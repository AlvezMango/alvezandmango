-- Run as the project database owner. All fixture data is rolled back inside
-- a subtransaction, even on failure. No emails are sent and no logins created.
do $test$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid();
  p uuid := gen_random_uuid(); n uuid := gen_random_uuid();
  pa uuid := gen_random_uuid(); pb uuid := gen_random_uuid();
  ga uuid := gen_random_uuid(); gb uuid := gen_random_uuid();
  da uuid := gen_random_uuid(); db uuid := gen_random_uuid();
  oa uuid := gen_random_uuid(); ob uuid := gen_random_uuid();
  extra_draft uuid := gen_random_uuid();
  admin_id uuid; admin_email text; changed integer; checks integer := 0;
  email_a text := 'rls-a-' || a || '@example.invalid';
  email_b text := 'rls-b-' || b || '@example.invalid';
  email_p text := 'rls-p-' || p || '@example.invalid';
  email_n text := 'rls-n-' || n || '@example.invalid';
  table_name text;
begin
  begin
    select u.id,u.email into strict admin_id,admin_email
    from private.portal_admins m join auth.users u on u.id=m.user_id
    where lower(u.email)='admin@alvezandmango.com';

    insert into auth.users(id,aud,role,email,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
    values
      (a,'authenticated','authenticated',email_a,now(),'{}','{}',now(),now()),
      (b,'authenticated','authenticated',email_b,now(),'{}','{}',now(),now()),
      (p,'authenticated','authenticated',email_p,now(),'{}','{}',now(),now()),
      (n,'authenticated','authenticated',email_n,now(),'{}','{}',now(),now());
    insert into public.photographers(id,user_id,email,name,phone,instagram,city,country,status)
    values
      (pa,a,email_a,'RLS Test A','test','test','test','test','approved'),
      (pb,b,email_b,'RLS Test B','test','test','test','test','approved'),
      (gen_random_uuid(),p,email_p,'RLS Pending','test','test','test','test','pending');
    insert into public.guests(id,user_id,name,email)
    values (ga,a,'RLS Guest A',email_a),(gb,b,'RLS Guest B',email_b);
    insert into public.drafts(id,user_id,guest_id,draft_name)
    values (da,a,ga,'RLS Draft A'),(db,b,gb,'RLS Draft B');
    insert into public.orders(id,user_id,guest_id,draft_id,order_number,total_price,internal_notes,production_notes)
    values (oa,a,ga,da,'RLS-A-'||a,100,'PRIVATE STAFF A','PRIVATE PRODUCTION A'),
           (ob,b,gb,db,'RLS-B-'||b,200,'PRIVATE STAFF B','PRIVATE PRODUCTION B');

    perform set_config('request.jwt.claim.sub','',true);
    perform set_config('request.jwt.claims','{}',true);
    execute 'set local role anon';
    foreach table_name in array array['photographers','guests','drafts','orders'] loop
      if has_table_privilege('anon','public.'||table_name,'SELECT')
         or has_table_privilege('anon','public.'||table_name,'INSERT') then
        raise exception 'Visitor can access %',table_name;
      end if;
      checks := checks + 1;
    end loop;
    begin
      perform * from public.photographers;
      raise exception 'Visitor read unexpectedly succeeded';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      insert into public.drafts(draft_name) values ('must fail');
      raise exception 'Old public testing insert still works';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      perform * from public.photographer_orders();
      raise exception 'Visitor order RPC unexpectedly succeeded';
    exception when insufficient_privilege then checks := checks + 1; end;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',a::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',a,'email',email_a,'role','authenticated','user_metadata',jsonb_build_object('role','admin','approved',true))::text,true);
    execute 'set local role authenticated';
    if private.is_portal_admin() then raise exception 'User metadata granted admin'; end if;
    checks := checks + 1;
    if (select count(*) from public.photographers)<>1 or not exists(select 1 from public.photographers where id=pa) then
      raise exception 'Photographer A profile isolation failed'; end if;
    checks := checks + 1;
    if (select count(*) from public.guests)<>1 or not exists(select 1 from public.guests where id=ga) then
      raise exception 'Guest isolation failed'; end if;
    checks := checks + 1;
    if (select count(*) from public.drafts)<>1 or not exists(select 1 from public.drafts where id=da) then
      raise exception 'Draft isolation or legacy-unowned protection failed'; end if;
    checks := checks + 1;
    if exists(select 1 from public.orders) then raise exception 'Customer can read raw staff order records'; end if;
    checks := checks + 1;
    if (select count(*) from public.photographer_orders())<>1
       or not exists(select 1 from public.photographer_orders() where id=oa) then
      raise exception 'Order summary isolation failed'; end if;
    checks := checks + 1;
    if exists(select 1 from public.photographer_orders() o where to_jsonb(o) ?| array['internal_notes','production_notes']) then
      raise exception 'Private staff notes exposed'; end if;
    checks := checks + 1;

    update public.photographers set phone='updated own phone' where id=pa;
    get diagnostics changed = row_count;
    if changed<>1 then raise exception 'Own profile update blocked'; end if;
    checks := checks + 1;
    update public.photographers set phone='must not change' where id=pb;
    get diagnostics changed = row_count;
    if changed<>0 then raise exception 'Cross-account profile update allowed'; end if;
    checks := checks + 1;
    begin
      update public.photographers set role='admin' where id=pa;
      raise exception 'Self-promotion allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      update public.photographers set status='pending' where id=pa;
      raise exception 'Self-status change allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      update public.photographers set user_id=b where id=pa;
      raise exception 'Profile ownership reassignment allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      update public.photographers set email=email_b where id=pa;
      raise exception 'Profile email impersonation allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      insert into private.portal_admins(user_id) values (a);
      raise exception 'Self-granted administrator membership';
    exception when insufficient_privilege then checks := checks + 1; end;
    if has_table_privilege('authenticated','public.photographers','TRUNCATE') then
      raise exception 'Authenticated role retains TRUNCATE'; end if;
    checks := checks + 1;

    insert into public.drafts(id,draft_name,guest_id) values(extra_draft,'Own allowed draft',ga);
    if not exists(select 1 from public.drafts where id=extra_draft and user_id=a) then
      raise exception 'Default ownership failed'; end if;
    checks := checks + 1;
    begin
      insert into public.drafts(user_id,draft_name) values(b,'must fail');
      raise exception 'Cross-owner draft insert allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      update public.drafts set user_id=b where id=extra_draft;
      raise exception 'Draft ownership reassignment allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      update public.drafts set guest_id=gb where id=extra_draft;
      raise exception 'Cross-owner guest link allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    update public.drafts set notes='must not change' where id=db;
    get diagnostics changed = row_count;
    if changed<>0 then raise exception 'Cross-owner draft update allowed'; end if;
    checks := checks + 1;
    delete from public.drafts where id=db;
    get diagnostics changed = row_count;
    if changed<>0 then raise exception 'Cross-owner draft delete allowed'; end if;
    checks := checks + 1;
    delete from public.drafts where id=extra_draft;
    get diagnostics changed = row_count;
    if changed<>1 then raise exception 'Own draft delete blocked'; end if;
    checks := checks + 1;
    update public.orders set total_price=1 where id=oa;
    get diagnostics changed = row_count;
    if changed<>0 then raise exception 'Customer changed accepted price'; end if;
    checks := checks + 1;
    begin
      insert into public.orders(user_id,order_number,total_price) values(a,'must fail',1);
      raise exception 'Customer inserted accepted order directly';
    exception when insufficient_privilege then checks := checks + 1; end;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',b::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',b,'email',email_b,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    if (select count(*) from public.photographers)<>1 or not exists(select 1 from public.photographers where id=pb)
       or (select count(*) from public.photographer_orders())<>1 or not exists(select 1 from public.photographer_orders() where id=ob) then
      raise exception 'Photographer B isolation failed'; end if;
    checks := checks + 1;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',p::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',p,'email',email_p,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    if (select count(*) from public.photographers)<>1 or exists(select 1 from public.drafts)
       or exists(select 1 from public.photographer_orders()) then
      raise exception 'Pending account access failed'; end if;
    checks := checks + 1;
    begin
      insert into public.drafts(draft_name) values('must fail');
      raise exception 'Unapproved account created a draft';
    exception when insufficient_privilege then checks := checks + 1; end;
    begin
      update public.photographers set status='approved' where user_id=p;
      raise exception 'Pending photographer approved themselves';
    exception when insufficient_privilege then checks := checks + 1; end;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',n::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',n,'email',email_n,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    begin
      insert into public.photographers(user_id,email,name,status) values(n,email_n,'must fail','approved');
      raise exception 'Self-approved profile creation allowed';
    exception when insufficient_privilege then checks := checks + 1; end;
    insert into public.photographers(email,name) values(email_n,'New pending photographer');
    if not exists(select 1 from public.photographers where user_id=n and status='pending' and role='photographer') then
      raise exception 'Own pending profile creation failed'; end if;
    checks := checks + 1;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',admin_id::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'email',admin_email,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    if not private.is_portal_admin() or (select count(*) from public.orders where id in (oa,ob))<>2
       or (select count(*) from public.photographers where user_id in (a,b,p,n))<>4 then
      raise exception 'Administrator access failed'; end if;
    checks := checks + 1;
    update public.orders set status='in_production',production_notes='Staff only change' where id=oa;
    get diagnostics changed = row_count;
    if changed<>1 then raise exception 'Administrator order management failed'; end if;
    checks := checks + 1;
    update public.photographers set status='blocked',is_blocked=true where id=pa;
    get diagnostics changed = row_count;
    if changed<>1 then raise exception 'Administrator blocking failed'; end if;
    checks := checks + 1;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',a::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',a,'email',email_a,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    if exists(select 1 from public.photographers) or exists(select 1 from public.drafts)
       or exists(select 1 from public.guests) or exists(select 1 from public.photographer_orders()) then
      raise exception 'Blocking did not immediately revoke access'; end if;
    checks := checks + 1;
    update public.photographers set status='approved',is_blocked=false where id=pa;
    get diagnostics changed = row_count;
    if changed<>0 then raise exception 'Blocked account unblocked itself'; end if;
    checks := checks + 1;
    execute 'reset role';

    perform set_config('request.jwt.claim.sub',admin_id::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'email',admin_email,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    update public.photographers set status='approved',is_blocked=false where id=pa;
    execute 'reset role';
    perform set_config('request.jwt.claim.sub',a::text,true);
    perform set_config('request.jwt.claims',jsonb_build_object('sub',a,'email',email_a,'role','authenticated')::text,true);
    execute 'set local role authenticated';
    if (select count(*) from public.photographer_orders())<>1 then raise exception 'Restored access failed'; end if;
    checks := checks + 1;
    execute 'reset role';

    raise exception using errcode='PT001',message='Rollback test fixtures after success';
  exception when sqlstate 'PT001' then null;
  end;
  perform set_config('alvez.security_test_result',jsonb_build_object('passed',true,'checks',checks,'fixtures_rolled_back',true)::text,true);
end;
$test$;
select current_setting('alvez.security_test_result')::jsonb as security_test_result;
