-- Browser clients only need the checked boolean, not the membership table.
-- The helper stays outside the exposed API schema and checks auth.uid().
alter function private.is_portal_admin() security definer;
revoke select on private.portal_admins from authenticated;
drop policy portal_admins_read_self on private.portal_admins;

-- This is a database event trigger, not a public RPC. PostgreSQL continues
-- invoking it for its existing DDL trigger without browser EXECUTE privileges.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
