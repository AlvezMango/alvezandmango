-- Account ownership and database-enforced permissions for the existing portal.
-- Preserve the existing administrator profile and two legacy drafts.
-- No passwords or invitation/approval decisions come from browser storage.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create table private.portal_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table private.portal_admins enable row level security;
revoke all on private.portal_admins from public, anon, authenticated;
grant select on private.portal_admins to authenticated;
grant all on private.portal_admins to service_role;
create policy portal_admins_read_self on private.portal_admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Bind the already-existing, verified administrator account once. This does
-- not grant administrator rights to anyone who registers this email later.
insert into private.portal_admins (user_id)
select id from auth.users
where lower(email) = 'admin@alvezandmango.com' and email_confirmed_at is not null;

create function private.is_portal_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from private.portal_admins where user_id = auth.uid()
  );
$$;
revoke all on function private.is_portal_admin() from public, anon;
grant execute on function private.is_portal_admin() to authenticated, service_role;

alter table public.photographers
  add column user_id uuid default auth.uid() references auth.users(id) on delete cascade,
  add column role text not null default 'photographer' check (role in ('photographer','admin','staff')),
  add column is_blocked boolean not null default false,
  add constraint photographers_user_id_key unique (user_id),
  alter column status set default 'pending';

-- Existing profile IDs already match the verified Auth identity. Require both
-- ID and email to match; never guess ownership from a photographer's name.
update public.photographers p set user_id = u.id
from auth.users u
where p.id = u.id and lower(p.email) = lower(u.email) and u.email_confirmed_at is not null;
alter table public.photographers alter column user_id set not null;
update public.photographers p set role = 'admin'
where exists (select 1 from private.portal_admins a where a.user_id = p.user_id);

alter table public.guests add column user_id uuid default auth.uid() references auth.users(id) on delete set null;
alter table public.drafts add column user_id uuid default auth.uid() references auth.users(id) on delete set null;
alter table public.orders add column user_id uuid default auth.uid() references auth.users(id) on delete set null;
create index guests_user_id_idx on public.guests(user_id);
create index drafts_user_id_idx on public.drafts(user_id);
create index orders_user_id_idx on public.orders(user_id);

alter table public.drafts add constraint drafts_guest_id_fkey foreign key (guest_id) references public.guests(id) on delete set null;
alter table public.orders add constraint orders_guest_id_fkey foreign key (guest_id) references public.guests(id) on delete set null;
alter table public.orders add constraint orders_draft_id_fkey foreign key (draft_id) references public.drafts(id) on delete set null;
create index drafts_guest_id_idx on public.drafts(guest_id);
create index orders_guest_id_idx on public.orders(guest_id);
create index orders_draft_id_idx on public.orders(draft_id);

alter table public.photographers enable row level security;
alter table public.guests enable row level security;
alter table public.drafts enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Allow insert for testing" on public.drafts;
revoke all on public.photographers, public.guests, public.drafts, public.orders from public, anon, authenticated;
grant select, insert, update, delete on public.photographers, public.guests, public.drafts, public.orders to authenticated;

create policy photographers_admin_all on public.photographers
  for all to authenticated
  using ((select private.is_portal_admin())) with check ((select private.is_portal_admin()));
create policy photographers_read_own on public.photographers
  for select to authenticated using (
    user_id = (select auth.uid()) and not is_blocked
    and status not in ('blocked','suspended','revoked')
  );
create policy photographers_create_own_pending on public.photographers
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and lower(email) = lower((select auth.jwt()->>'email'))
    and status = 'pending' and role = 'photographer' and not is_blocked
  );
create policy photographers_update_own on public.photographers
  for update to authenticated
  using (user_id = (select auth.uid()) and not is_blocked and status not in ('blocked','suspended','revoked'))
  with check (user_id = (select auth.uid()) and not is_blocked and status not in ('blocked','suspended','revoked'));

-- RLS controls rows; this trigger also protects approval and identity fields
-- while allowing the existing administrator UI to manage those fields.
create function private.guard_photographer_profile() returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if current_user in ('anon','authenticated') and not private.is_portal_admin() then
    if row(new.id,new.user_id,new.email,new.status,new.role,new.is_blocked,new.created_at)
       is distinct from
       row(old.id,old.user_id,old.email,old.status,old.role,old.is_blocked,old.created_at) then
      raise exception 'Only an administrator can change account identity or approval fields' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.guard_photographer_profile() from public, anon, authenticated;
create trigger guard_photographer_profile before update on public.photographers
  for each row execute function private.guard_photographer_profile();

create function private.has_photographer_access() returns boolean
language sql stable security invoker set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.photographers
    where user_id = auth.uid() and status = 'approved' and not is_blocked
  );
$$;
revoke all on function private.has_photographer_access() from public, anon;
grant execute on function private.has_photographer_access() to authenticated, service_role;

create policy guests_admin_all on public.guests for all to authenticated
  using ((select private.is_portal_admin())) with check ((select private.is_portal_admin()));
create policy guests_owner_all on public.guests for all to authenticated
  using (user_id = (select auth.uid()) and (select private.has_photographer_access()))
  with check (user_id = (select auth.uid()) and (select private.has_photographer_access()));

create policy drafts_admin_all on public.drafts for all to authenticated
  using ((select private.is_portal_admin())) with check ((select private.is_portal_admin()));
create policy drafts_owner_read on public.drafts for select to authenticated
  using (user_id = (select auth.uid()) and (select private.has_photographer_access()));
create policy drafts_owner_insert on public.drafts for insert to authenticated
  with check (
    user_id = (select auth.uid()) and (select private.has_photographer_access())
    and (guest_id is null or exists (
      select 1 from public.guests g where g.id = guest_id and g.user_id = (select auth.uid())
    ))
  );
create policy drafts_owner_update on public.drafts for update to authenticated
  using (user_id = (select auth.uid()) and (select private.has_photographer_access()))
  with check (
    user_id = (select auth.uid()) and (select private.has_photographer_access())
    and (guest_id is null or exists (
      select 1 from public.guests g where g.id = guest_id and g.user_id = (select auth.uid())
    ))
  );
create policy drafts_owner_delete on public.drafts for delete to authenticated
  using (user_id = (select auth.uid()) and (select private.has_photographer_access()));

-- Accepted orders and prices are created/changed by trusted staff/server code.
-- The base table contains private staff notes, so customer reads use a narrow RPC.
create policy orders_admin_all on public.orders for all to authenticated
  using ((select private.is_portal_admin())) with check ((select private.is_portal_admin()));

create function private.photographer_orders()
returns table (
  id uuid, order_number text, status text, album_type text, album_size text,
  cover_material text, cover_color text, cover_text text, font_choice text,
  spreads bigint, parent_album_type text, parent_album_qty bigint,
  has_presentation_box boolean, box_type text, total_price numeric,
  created_at timestamp without time zone, updated_at timestamp without time zone
)
language sql stable security definer set search_path = ''
as $$
  select o.id, o.order_number, o.status, o.album_type, o.album_size,
    o.cover_material, o.cover_color, o.cover_text, o.font_choice,
    o.spreads, o.parent_album_type, o.parent_album_qty,
    o.has_presentation_box, o.box_type, o.total_price, o.created_at, o.updated_at
  from public.orders o
  where auth.uid() is not null and o.user_id = auth.uid()
    and exists (
      select 1 from public.photographers p
      where p.user_id = auth.uid() and p.status = 'approved' and not p.is_blocked
    )
  order by o.created_at desc;
$$;
revoke all on function private.photographer_orders() from public, anon;
grant execute on function private.photographer_orders() to authenticated;

create function public.photographer_orders()
returns table (
  id uuid, order_number text, status text, album_type text, album_size text,
  cover_material text, cover_color text, cover_text text, font_choice text,
  spreads bigint, parent_album_type text, parent_album_qty bigint,
  has_presentation_box boolean, box_type text, total_price numeric,
  created_at timestamp without time zone, updated_at timestamp without time zone
)
language sql stable security invoker set search_path = ''
as $$ select * from private.photographer_orders(); $$;
revoke all on function public.photographer_orders() from public, anon;
grant execute on function public.photographer_orders() to authenticated;

comment on table private.portal_admins is 'Server-managed administrator membership; browser clients cannot grant themselves membership.';
comment on function public.photographer_orders() is 'Read-only customer order summary. Requires an approved account; returns only its own orders and excludes private staff notes.';
comment on column public.photographers.user_id is 'Supabase Auth user ID, distinct from the profile record ID.';
comment on column public.drafts.total_price is 'Untrusted draft estimate. Recalculate server-side before accepting an order.';
