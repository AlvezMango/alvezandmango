# Photographer account access

Applied to the existing Alvez & Mango Supabase project on 17 October 2026.
These are incremental migrations for the existing tables, not a fresh-project baseline.

## Live changes

- All four application tables now enforce row-level security. Anonymous table access and the old `Allow insert for testing` draft policy were removed.
- Profiles, guests, drafts and orders have an Auth `user_id` ownership link. Permissions never identify an owner by name, Instagram handle, or client-side browser storage.
- The existing verified `admin@alvezandmango.com` account was bound to server-controlled administrator membership. This is a one-time binding to its Auth ID; re-registering the same address later does not grant administrator access.
- Photographers can update their own contact/profile fields. Identity, email, approval status, role and blocking flags are protected against self-editing.
- Pending profiles have no draft/order access. Approved photographers can manage their own guests and drafts. Blocking immediately removes that access, including for an already-issued login token.
- Accepted orders, final prices and production status can only be managed by trusted staff/server code.
- Customer order reads use `supabase.rpc('photographer_orders')`. This returns only the approved caller's orders and excludes internal and production notes. The existing admin interface can still use the full `orders` table.
- Internal administrator membership is inaccessible to browser clients. Its private helper checks the authenticated user ID. The old DDL event-trigger function is no longer callable as a public RPC.

| Access | Own profile | Own drafts/guests | Own order summary | All records / approval |
| --- | --- | --- | --- | --- |
| Visitor | No | No | No | No |
| Pending photographer | Read/contact updates | No | No | No |
| Approved photographer | Read/contact updates | Yes | Read only via RPC | No |
| Blocked photographer | No | No | No | No |
| Administrator | Yes | Yes | Yes | Yes |

The profile `role` column is a protected display field. Actual administrator authority comes from `private.portal_admins`; user-editable Auth metadata never grants access.

## Preservation and verification

Exact counts, rather than estimated table statistics, found one existing administrator profile and two legacy drafts. Both were preserved. The drafts had no authenticated ownership link and remain administrator-only until ownership can be verified; no ownership was guessed.

`tests/access_rules.sql` passed **43 checks** after the final migration. It exercises visitor denial, two isolated photographers, own-profile editing, cross-account read/update/delete denial, self-promotion and self-approval denial, ownership and guest-link reassignment denial, private order-note exclusion, final-price protection, pending access, immediate blocking/restoration, and administrator management. Fixture records are rolled back using a subtransaction; no emails or sign-in sessions are created.

After testing: 1 photographer profile, 2 drafts, 0 guests, 0 orders and 1 Auth account. No test data remains.

Applied migration history:

- `20261017061309_secure_photographer_access`
- `20261017062131_restrict_internal_security_helpers`

Files were created with Supabase CLI `2.121.0`, then matched to the versions returned by the live migration history.

## Portal integration still required

This update secures the database; it does not launch the new customer account interface. The old registration page remains a browser-storage demo and must be replaced with real Supabase Auth registration before customer use. The new invitation flow must validate an invitation on the trusted server, approve only the authenticated invited account, and consume that invitation atomically. An arbitrary signup must remain pending.

Use the logged-in Auth user ID when creating profiles/drafts. `user_id` defaults to the authenticated caller; explicitly assign the correct owner in trusted server/admin order creation. Use the customer order-summary RPC instead of direct customer reads of the staff order table. Recalculate draft prices on the server when accepting an order; draft `total_price` is an untrusted estimate.

The quote-form layout, costing desk, passwords, existing website files and storage bucket policies were not changed by these migrations. NAS upload and invitation integration remain separate work.

## Remaining advisor notices

- [Authenticated GraphQL schema visibility](https://supabase.com/docs/guides/database/database-linter?lint=0027_pg_graphql_authenticated_table_exposed): intentional for the four application tables. Discovering a table's schema does not bypass its tested RLS policies.
- [RLS with no policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy): intentional for the private administrator-membership table. Browser clients have no table privileges; only a narrowly scoped private helper reads membership.
- [Leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) remains disabled in Supabase Auth. Enable it when configuring production registration; it is separate from these database access rules.
