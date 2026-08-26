# Kayan Supabase setup

Apply `migrations/202608260001_phase1_admin_client.sql` to a Supabase project, then set the two public Vite variables shown in `.env.example`. Never expose a service-role key to Vite.

For the first vertical-flow check, create two Supabase Auth users and matching `public.users` rows: one `staff` user with an active `staff_profiles` row (`sys` or `clientdesk`), and one `client` user with a `client_profiles` row. Create one submitted `client_files` row for that client. Its `scope` may contain:

```json
{
  "summary": "Approved scope copy",
  "deadline": "2026-09-30",
  "deliverables": [{ "title": "First deliverable", "sort_order": 1 }],
  "definition_of_done": ["Approved definition of done"],
  "pod_name": "Optional pod name",
  "pod_lead": "Optional lead display name"
}
```

Sign in at `/admin`, open Client Files, and convert the row. The single database transaction changes the file status, creates the engagement and initial deliverables, optionally creates a pod, emits the required audit events, and creates the client notification. Sign in as the client and open `/space/client`; it reads the latest engagement from those same records.
