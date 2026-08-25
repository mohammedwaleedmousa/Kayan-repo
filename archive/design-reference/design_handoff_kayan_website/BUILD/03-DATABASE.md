# 03 — DATABASE: PostgreSQL 16 schema (binding)

## §1 Conventions

- Postgres 16; extensions `pgcrypto`, `citext`. Internal PKs `uuid DEFAULT gen_random_uuid()`; public codes (`KY-T-…`) are separate unique columns — never expose UUIDs in UI, never use codes as FKs.
- Money `bigint` cents USD. Time `timestamptz` (UTC). Soft enums = `text` + `CHECK` (Drizzle-friendly, migration-cheap).
- Every table gets `created_at timestamptz NOT NULL DEFAULT now()`; mutable tables also `updated_at` (trigger below).
- Append-only tables (`escrow_entries`, `audit_log`, `pod_journal`, `application_events`, `login_attempts`) reject UPDATE/DELETE by trigger.
- One Drizzle migration per session, committed; `drizzle-kit generate` must be deterministic (re-run ⇒ no diff).

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE FUNCTION touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS
$$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE FUNCTION forbid_mutation() RETURNS trigger LANGUAGE plpgsql AS
$$ BEGIN RAISE EXCEPTION 'append-only table %', TG_TABLE_NAME; END $$;
```

## §2 DDL

### 2.1 Reference data (seeded, admin-editable only where noted)

```sql
CREATE TABLE spec_families (
  code text PRIMARY KEY, name_ar text NOT NULL, name_en text NOT NULL DEFAULT '', sort int NOT NULL DEFAULT 0);

CREATE TABLE specs (
  code text PRIMARY KEY,                        -- e.g. DES-UIX-014
  family_code text NOT NULL REFERENCES spec_families(code),
  name_ar text NOT NULL, name_en text NOT NULL DEFAULT '',
  micro jsonb NOT NULL DEFAULT '[]',            -- micro-specs [{code,name_ar}]
  active boolean NOT NULL DEFAULT true);
CREATE INDEX ON specs(family_code);

CREATE TABLE banks (code text PRIMARY KEY, name_ar text NOT NULL, name_en text DEFAULT '', sort int DEFAULT 0, active boolean NOT NULL DEFAULT true);
CREATE TABLE wallets (code text PRIMARY KEY, name_ar text NOT NULL, cap_note_ar text DEFAULT '', active boolean NOT NULL DEFAULT true);
CREATE TABLE languages (code text PRIMARY KEY, name_ar text NOT NULL, name_en text DEFAULT '');
CREATE TABLE governorates (code text PRIMARY KEY, name_ar text NOT NULL, name_en text DEFAULT '');
CREATE TABLE doc_kinds (code text PRIMARY KEY, name_ar text NOT NULL, required boolean NOT NULL DEFAULT false, accepts text NOT NULL DEFAULT 'pdf,jpg,png');
CREATE TABLE consents (
  idx smallint PRIMARY KEY CHECK (idx BETWEEN 1 AND 13),
  required boolean NOT NULL, text_ar text NOT NULL, text_en text DEFAULT '', version int NOT NULL DEFAULT 1);

CREATE TABLE positions (                         -- People vacancies POS-01…
  code text PRIMARY KEY, title_ar text NOT NULL, track text NOT NULL DEFAULT '',
  location_ar text NOT NULL, salary_band text NOT NULL,        -- published, per business rule 9
  body jsonb NOT NULL DEFAULT '{}',
  opens_at timestamptz NOT NULL, closes_at timestamptz NOT NULL, -- ≥ 14 days apart (service-enforced)
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('draft','open','closed')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE products (                          -- Ready Products RP-F-…/RP-R-…
  code text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('fixed','range')),
  name_ar text NOT NULL, name_en text DEFAULT '',
  price_min_cents bigint NOT NULL CHECK (price_min_cents >= 0),
  price_max_cents bigint CHECK (price_max_cents >= price_min_cents),   -- NULL for fixed
  card jsonb NOT NULL,                           -- {get_ar, who_ar, why_ar, time_ar, protection_ar,…} exact card fields
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','retired')),
  published_at timestamptz, updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
```

### 2.2 Identity & auth

```sql
CREATE TABLE accounts (                          -- clients + talents (public users)
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('client','talent')),
  email citext NOT NULL UNIQUE,
  pw_hash text NOT NULL,                         -- Argon2id encoded string
  name text NOT NULL, org text, phone text,
  email_verified_at timestamptz,
  registry_id text UNIQUE,                       -- KY-C-…/KY-T-… once issued
  tier smallint CHECK (tier BETWEEN 0 AND 4),    -- talents only
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','closed')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE staff_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adm_no text NOT NULL UNIQUE,                   -- ADM-26-01
  name text NOT NULL, email citext NOT NULL UNIQUE,
  pw_hash text NOT NULL DEFAULT '',
  role text NOT NULL CHECK (role IN ('sys','registrar','clientdesk','escrow','delivery','compliance','people','editor','auditor')),
  totp_secret_enc bytea, totp_enabled_at timestamptz,
  backup_codes jsonb NOT NULL DEFAULT '[]',      -- hashed
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','suspended')),
  invited_by uuid REFERENCES staff_users(id),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash bytea NOT NULL UNIQUE,              -- sha256(opaque token)
  subject_kind text NOT NULL CHECK (subject_kind IN ('account','staff')),
  subject_id uuid NOT NULL,
  ip inet, ua text,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  idle_expires_at timestamptz NOT NULL,
  absolute_expires_at timestamptz NOT NULL,
  revoked_at timestamptz);
CREATE INDEX ON sessions(subject_kind, subject_id);

CREATE TABLE auth_tokens (                       -- OTP, reset, verify, staff invite, bootstrap
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('otp','reset','verify','invite','stepup')),
  purpose text NOT NULL DEFAULT '',              -- e.g. apply-phone, portal-phone, signin-verify
  target text NOT NULL,                          -- email or phone (E.164)
  subject_kind text CHECK (subject_kind IN ('account','staff')), subject_id uuid,
  code_hash bytea NOT NULL,                      -- sha256(code + OTP_PEPPER)
  payload jsonb NOT NULL DEFAULT '{}',
  attempts smallint NOT NULL DEFAULT 0, max_attempts smallint NOT NULL DEFAULT 5,
  expires_at timestamptz NOT NULL, used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON auth_tokens(kind, target, expires_at);

CREATE TABLE login_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_kind text NOT NULL, identifier citext NOT NULL, ip inet, ok boolean NOT NULL,
  at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON login_attempts(identifier, at DESC);

CREATE TABLE visitor_tokens (                    -- anonymous People receipts scope (04-API §9)
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash bytea NOT NULL UNIQUE,
  account_id uuid REFERENCES accounts(id),       -- linked on signup (optional merge)
  created_at timestamptz NOT NULL DEFAULT now());
```

### 2.3 Talent pipeline

```sql
CREATE TABLE talent_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_no text UNIQUE,                            -- APP-26-0192, issued on submit
  account_id uuid REFERENCES accounts(id),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','submitted','in_review','needs_fix','approved','refused','withdrawn')),
  stations jsonb NOT NULL DEFAULT '{}',          -- station payloads, shapes = design's kayan-apply-v1
  station_done smallint NOT NULL DEFAULT 0 CHECK (station_done BETWEEN 0 AND 14),
  version int NOT NULL DEFAULT 1,                -- optimistic autosave
  submitted_at timestamptz,
  decided_at timestamptz, decided_by uuid REFERENCES staff_users(id),
  decision_reason text,                          -- MANDATORY on refusal (service-enforced, ≥ 20 chars)
  registry_id_issued text,                       -- KY-T-… when approved
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON talent_applications(status, submitted_at);

CREATE TABLE application_events (                -- review trail (append-only)
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id uuid NOT NULL REFERENCES talent_applications(id),
  kind text NOT NULL,                            -- submitted|note|fix_requested|approved|refused|appealed…
  note text, by_staff uuid REFERENCES staff_users(id),
  at timestamptz NOT NULL DEFAULT now());

CREATE TABLE ref_checks (                        -- جهات التزكية
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES talent_applications(id),
  name text NOT NULL, relation text NOT NULL, phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','received','unreachable')),
  received_at timestamptz, note text,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE appeals (                           -- one appeal within 21 days
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL UNIQUE REFERENCES talent_applications(id),
  opened_at timestamptz NOT NULL DEFAULT now(),
  window_ends_at timestamptz NOT NULL,
  grounds text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','upheld','denied','expired')),
  decided_by uuid REFERENCES staff_users(id), decided_at timestamptz, decision_reason text);

CREATE TABLE talent_profiles (                   -- exists once approved
  account_id uuid PRIMARY KEY REFERENCES accounts(id),
  registry_id text NOT NULL UNIQUE,
  tier smallint NOT NULL DEFAULT 1 CHECK (tier BETWEEN 0 AND 4),
  axes jsonb NOT NULL DEFAULT '{}',              -- {identity,spec,language,refs,conduct} scores/labels
  specs jsonb NOT NULL DEFAULT '[]',             -- max 5 codes, [0] = primary
  langs jsonb NOT NULL DEFAULT '[]',             -- [{code, cefr, proof}]
  availability text NOT NULL DEFAULT 'open',
  week jsonb NOT NULL DEFAULT '[]',              -- 7 booleans (weekly readiness)
  k4y_optin boolean NOT NULL DEFAULT false, k4y_hours int NOT NULL DEFAULT 0,
  dormant_since timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE payout_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES accounts(id),
  channel text NOT NULL CHECK (channel IN ('bank','wallet')),
  provider_code text NOT NULL,                   -- FK-ish to banks/wallets by channel (service-checked)
  details_enc bytea NOT NULL,                    -- AES-256-GCM (07-SECURITY §7)
  is_primary boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX one_primary_payout ON payout_accounts(account_id) WHERE is_primary;
```

### 2.4 Client pipeline

```sql
CREATE TABLE client_files (                      -- وثيقة فتح النطاق (KY-F)
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_no text UNIQUE,                           -- KY-F-26-00431, issued on submit
  account_id uuid REFERENCES accounts(id),       -- may be NULL for anonymous draft (bridge doctrine)
  visitor_token_id uuid REFERENCES visitor_tokens(id),
  email citext,                                  -- server ties file ↔ account by email
  stage smallint NOT NULL DEFAULT 0 CHECK (stage BETWEEN 0 AND 5),
  org jsonb NOT NULL DEFAULT '{}', authority jsonb NOT NULL DEFAULT '{}',
  compliance jsonb NOT NULL DEFAULT '[]',        -- 4 booleans
  scope jsonb NOT NULL DEFAULT '{}',             -- {outcome,line,deadline,budget,desc,files[]}
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','submitted','in_review','converted','referred_k4y','declined','closed')),
  submitted_at timestamptz, converted_at timestamptz,
  engagement_id uuid,                            -- set on convert
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON client_files(status, submitted_at);
```

### 2.5 Engagements & money

```sql
CREATE TABLE engagements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_no text NOT NULL UNIQUE,                   -- KY-J-26-00417
  client_account_id uuid NOT NULL REFERENCES accounts(id),
  file_id uuid NOT NULL REFERENCES client_files(id),
  title text NOT NULL, line text NOT NULL,
  price_cents bigint NOT NULL CHECK (price_cents > 0),
  currency text NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
  deadline_at timestamptz,
  stage smallint NOT NULL DEFAULT 0 CHECK (stage BETWEEN 0 AND 5),  -- التعاقد→الإيداع→التجهيز→التنفيذ→المراجعة→الإقفال
  dod jsonb NOT NULL DEFAULT '[]',               -- definition of done items
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','accepted','warranty','closed','cancelled')),
  accepted_at timestamptz, warranty_ends_at timestamptz,
  created_by uuid REFERENCES staff_users(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id),
  code text NOT NULL,                            -- D-01…
  name text NOT NULL, note text DEFAULT '',
  amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
  status text NOT NULL DEFAULT 'wip' CHECK (status IN ('wip','review','accepted')),
  sort int NOT NULL DEFAULT 0,
  accepted_at timestamptz, accepted_signature text, accepted_by_account uuid REFERENCES accounts(id),
  UNIQUE (engagement_id, code));

CREATE TABLE escrow_entries (                    -- APPEND-ONLY. The money truth.
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  engagement_id uuid NOT NULL REFERENCES engagements(id),
  kind text NOT NULL CHECK (kind IN ('deposit','release','refund','adjust')),
  amount_cents bigint NOT NULL CHECK (amount_cents <> 0),
  -- sign law: deposit > 0; release < 0; refund < 0; adjust either (via accepted change order only)
  deliverable_id uuid REFERENCES deliverables(id),
  change_order_id uuid,
  memo_ar text NOT NULL,                         -- ledger line as shown in UI («إيداع ضمان النطاق»…)
  idempotency_key text NOT NULL UNIQUE,
  created_by_kind text NOT NULL CHECK (created_by_kind IN ('staff','system','account')),
  created_by_id uuid,
  created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON escrow_entries(engagement_id, id);

CREATE TABLE change_orders (                     -- أوامر التغيير
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id),
  co_no text NOT NULL,                           -- CO-01…
  title text NOT NULL, body text DEFAULT '',
  delta_cents bigint NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','declined','withdrawn')),
  sent_at timestamptz, decided_at timestamptz, decided_signature text,
  created_by_kind text NOT NULL, created_by_id uuid,
  UNIQUE (engagement_id, co_no));

ALTER TABLE escrow_entries ADD FOREIGN KEY (change_order_id) REFERENCES change_orders(id);
ALTER TABLE client_files   ADD FOREIGN KEY (engagement_id)  REFERENCES engagements(id);

CREATE TABLE messages (                          -- client ↔ Kayan thread per engagement
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id),
  sender_kind text NOT NULL CHECK (sender_kind IN ('client','staff','system')),
  sender_id uuid, body text NOT NULL,
  at timestamptz NOT NULL DEFAULT now(), read_at timestamptz);
CREATE INDEX ON messages(engagement_id, at);
```

### 2.6 Pods & gates

```sql
CREATE TABLE pods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,                     -- POD-26-041
  engagement_id uuid NOT NULL UNIQUE REFERENCES engagements(id),
  lead_account_id uuid NOT NULL REFERENCES accounts(id),   -- must be tier ≥ 3 (service-enforced)
  deadline_at timestamptz,
  current_gate smallint NOT NULL DEFAULT 0 CHECK (current_gate BETWEEN 0 AND 9),
  split jsonb NOT NULL DEFAULT '[]',             -- fixed split display [{account_id, ppm}]
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE pod_members (
  pod_id uuid NOT NULL REFERENCES pods(id),
  account_id uuid NOT NULL REFERENCES accounts(id),
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('lead','member')),
  share_ppm int NOT NULL DEFAULT 0 CHECK (share_ppm BETWEEN 0 AND 1000000),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (pod_id, account_id));

CREATE TABLE pod_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id uuid NOT NULL REFERENCES pods(id),
  title text NOT NULL,
  lane smallint NOT NULL DEFAULT 0 CHECK (lane BETWEEN 0 AND 3),  -- تجهيز/تنفيذ/مراجعة داخلية/مقبول
  owner_account_id uuid REFERENCES accounts(id),
  sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), moved_at timestamptz);

CREATE TABLE pod_journal (                       -- append-only delivery journal
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pod_id uuid NOT NULL REFERENCES pods(id),
  kind text NOT NULL CHECK (kind IN ('auto','manual')),          -- lane-3 moves write 'auto'
  body text NOT NULL, by_account uuid,
  at timestamptz NOT NULL DEFAULT now());

CREATE TABLE pod_chat (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pod_id uuid NOT NULL REFERENCES pods(id),
  by_account uuid NOT NULL REFERENCES accounts(id),
  body text NOT NULL, at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON pod_chat(pod_id, id);

CREATE TABLE gate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pod_id uuid NOT NULL REFERENCES pods(id),
  from_gate smallint NOT NULL, to_gate smallint NOT NULL,
  checks jsonb NOT NULL,                         -- 5 booleans; server re-validates all true
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined')),
  requested_by uuid NOT NULL REFERENCES accounts(id),
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_by uuid REFERENCES staff_users(id), decided_at timestamptz, reason text);
CREATE UNIQUE INDEX one_pending_gate ON gate_requests(pod_id) WHERE status = 'pending';

CREATE TABLE calls_for_pods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL, line text NOT NULL,
  spec_codes jsonb NOT NULL DEFAULT '[]', tier_min smallint NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  opens_at timestamptz NOT NULL DEFAULT now(), closes_at timestamptz);

CREATE TABLE call_interests (
  call_id uuid NOT NULL REFERENCES calls_for_pods(id),
  account_id uuid NOT NULL REFERENCES accounts(id),
  at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (call_id, account_id));
```

### 2.7 Files

```sql
CREATE TABLE stored_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_kind text NOT NULL CHECK (owner_kind IN ('account','staff','system')),
  owner_id uuid,
  scope text NOT NULL CHECK (scope IN ('apply','clientfile','engagement','pod','people')),
  scope_id uuid NOT NULL,
  orig_name text NOT NULL, mime text NOT NULL, bytes bigint NOT NULL,
  sha256 bytea NOT NULL,
  storage_path text,                             -- NULL after purge
  sensitive boolean NOT NULL DEFAULT false,      -- ID docs + selfies
  created_at timestamptz NOT NULL DEFAULT now(), purged_at timestamptz);
CREATE INDEX ON stored_files(scope, scope_id);
```

### 2.8 People desk

```sql
CREATE TABLE job_applications (                  -- ترشحات (People page)
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_no text NOT NULL UNIQUE,                   -- APP-26-0201 (shared APP counter with talent_applications)
  position_code text REFERENCES positions(code), -- NULL = GEN-POOL ترشح عام
  name text NOT NULL, contact text NOT NULL, note text DEFAULT '',
  visitor_token_id uuid REFERENCES visitor_tokens(id),
  account_id uuid REFERENCES accounts(id),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','shortlist','replied','closed')),
  sla_due_at timestamptz NOT NULL,
  replied_at timestamptz, replied_by uuid REFERENCES staff_users(id), reply_body text,
  created_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX one_app_per_pos_per_visitor
  ON job_applications(visitor_token_id, COALESCE(position_code,'GEN-POOL')) WHERE visitor_token_id IS NOT NULL;

CREATE TABLE contact_messages (                  -- مكتب السجل (REG-)
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no text NOT NULL UNIQUE,                   -- REG-26-0455
  door text NOT NULL CHECK (door IN ('clients','talent','partners','press')),
  subject text NOT NULL, body text NOT NULL, contact text NOT NULL,
  visitor_token_id uuid REFERENCES visitor_tokens(id),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','assigned','replied','closed')),
  assigned_to uuid REFERENCES staff_users(id),
  sla_due_at timestamptz NOT NULL,               -- computed BEFORE send, shown to the sender
  replied_at timestamptz, replied_by uuid REFERENCES staff_users(id), reply_body text,
  created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX ON contact_messages(status, sla_due_at);
```

### 2.9 Content & ops

```sql
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body_ar text NOT NULL, body_en text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','retired')),
  starts_at timestamptz, ends_at timestamptz,
  published_by uuid REFERENCES staff_users(id), published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX one_live_announcement ON announcements (status) WHERE status = 'published';

CREATE TABLE notifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject_kind text NOT NULL CHECK (subject_kind IN ('account','staff')),
  subject_id uuid NOT NULL,
  type text NOT NULL, title_ar text NOT NULL, href text DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(), read_at timestamptz);
CREATE INDEX unread_notifications ON notifications(subject_kind, subject_id) WHERE read_at IS NULL;

CREATE TABLE email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email citext NOT NULL, template text NOT NULL, locale text NOT NULL DEFAULT 'ar',
  subject text NOT NULL, payload jsonb NOT NULL DEFAULT '{}',
  registry_no text,                              -- the number in the subject
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed')),
  attempts smallint NOT NULL DEFAULT 0, last_error text,
  created_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz);

CREATE TABLE payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id),
  escrow_entry_id bigint NOT NULL REFERENCES escrow_entries(id),   -- the release that funded it
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','instructed','confirmed')),
  created_by uuid REFERENCES staff_users(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES payout_batches(id),
  account_id uuid NOT NULL REFERENCES accounts(id),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  channel text NOT NULL CHECK (channel IN ('bank','wallet')),
  payout_account_id uuid REFERENCES payout_accounts(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','instructed','confirmed','failed')),
  note text, updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE audit_log (                         -- APPEND-ONLY, hash-chained (§6)
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  at timestamptz NOT NULL DEFAULT now(),
  actor_kind text NOT NULL CHECK (actor_kind IN ('staff','account','system')),
  actor_id uuid, actor_label text NOT NULL,      -- 'registrar·s.awlaqi' style, as designed
  action text NOT NULL,                          -- verb-led Arabic line, admin log format
  object_table text NOT NULL, object_id text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  prev_hash bytea NOT NULL, hash bytea NOT NULL UNIQUE);
CREATE INDEX ON audit_log(object_table, object_id); CREATE INDEX ON audit_log(at DESC);

CREATE TABLE registry_counters (key text PRIMARY KEY, value bigint NOT NULL DEFAULT 0);
CREATE TABLE settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_by uuid, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE feature_flags (key text PRIMARY KEY, enabled boolean NOT NULL DEFAULT false, note text DEFAULT '');
CREATE TABLE rate_counters (key text PRIMARY KEY, window_start timestamptz NOT NULL, count int NOT NULL DEFAULT 0); -- fixed-window limiter backing 07-SECURITY §9
CREATE TABLE backups (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('db','files')),
  started_at timestamptz NOT NULL, finished_at timestamptz,
  bytes bigint, location text, ok boolean, note text);
CREATE TABLE k4y_hours (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES accounts(id),
  hours numeric(6,1) NOT NULL CHECK (hours > 0), note text NOT NULL,
  verified_by uuid REFERENCES staff_users(id), at timestamptz NOT NULL DEFAULT now());
CREATE TABLE worker_heartbeat (id smallint PRIMARY KEY DEFAULT 1, at timestamptz NOT NULL);
```

## §3 Invariants & triggers

```sql
-- Append-only guards
CREATE TRIGGER escrow_append_only BEFORE UPDATE OR DELETE ON escrow_entries FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER audit_append_only  BEFORE UPDATE OR DELETE ON audit_log      FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER journal_append_only BEFORE UPDATE OR DELETE ON pod_journal   FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER appevents_append_only BEFORE UPDATE OR DELETE ON application_events FOR EACH ROW EXECUTE FUNCTION forbid_mutation();

-- Escrow can never go negative
CREATE FUNCTION escrow_balance_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE bal bigint;
BEGIN
  SELECT COALESCE(SUM(amount_cents),0) INTO bal FROM escrow_entries WHERE engagement_id = NEW.engagement_id;
  IF bal < 0 THEN RAISE EXCEPTION 'escrow balance negative for %', NEW.engagement_id; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER escrow_no_negative AFTER INSERT ON escrow_entries FOR EACH ROW EXECUTE FUNCTION escrow_balance_guard();

-- updated_at touch on every mutable table (repeat per table)
CREATE TRIGGER touch BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
```

Service-level invariants (tested, not expressible cleanly in SQL): sign law per entry kind; release/refund ≤ current held; `adjust` requires an accepted change order id; engagement close requires balance = 0 and all deliverables accepted; pod lead tier ≥ 3; refusal requires `decision_reason`; positions open ≥ 14 days; consents 9 required indices all true at submit.

## §4 Views

```sql
CREATE VIEW escrow_balances AS
  SELECT engagement_id,
         COALESCE(SUM(amount_cents),0)                                   AS held_cents,
         COALESCE(-SUM(amount_cents) FILTER (WHERE kind='release'),0)    AS released_cents,
         COALESCE(SUM(amount_cents)  FILTER (WHERE kind='deposit'),0)    AS deposited_cents
  FROM escrow_entries GROUP BY engagement_id;
```

Admin overview KPIs (`06-ADMIN.md §5.1`) read from plain aggregate queries; add covering indexes if `EXPLAIN` shows seq scans on hot paths.

## §5 ID issuance (`domain/ids.ts` + `registry_counters`)

| Code | Format | Serial width | Check digit | Counter key example |
|---|---|---|---|---|
| Talent registry | `KY-T-YY-NNNNN-C` | 5 | yes | `KY-T-26` |
| Client registry | `KY-C-YY-NNNNN-C` | 5 | yes | `KY-C-26` |
| Client file | `KY-F-YY-NNNNN` | 5 | no | `KY-F-26` |
| Engagement | `KY-J-YY-NNNNN` | 5 | no | `KY-J-26` |
| Pod | `POD-YY-NNN` | 3 | no | `POD-26` |
| Application (talent + job, one shared counter) | `APP-YY-NNNN` | 4 | no | `APP-26` |
| Registry message | `REG-YY-NNNN` | 4 | no | `REG-26` |
| Staff | `ADM-YY-NN` | 2 | no | `ADM-26` |

Issue inside the owning transaction: `UPDATE registry_counters SET value = value + 1 WHERE key = $1 RETURNING value` (row created on demand). **Check digit** (KY-T/KY-C only): digits = `YY` + serial (7 digits), weights `[8,7,6,5,4,3,2]`, `check = (11 − (Σ dᵢwᵢ mod 11)) mod 11`, `10 → 'X'`. Vectors in `10-QA-ACCEPTANCE.md §3`. Codes are permanent: never reissued, never recycled, survive account closure.

## §6 Audit hash chain (`domain/audit.ts`)

- Canonical JSON: keys sorted, no whitespace, UTF-8, timestamps ISO-8601 UTC, of `{at, actor_kind, actor_id, actor_label, action, object_table, object_id, payload}`.
- `hash = sha256(prev_hash ‖ canonical_json)`; genesis `prev_hash` = 32 zero bytes. Insert takes `prev_hash` from the latest row `FOR UPDATE` (serialized writer inside the transaction).
- `verifyChain(fromId?)` walks rows in id order, recomputes, reports first mismatch. Exposed as `POST /api/v1/admin/audit/verify` (auditor+) and CLI `pnpm audit:verify` (used by the nightly backup job — a backup of a broken chain must alarm, not silently succeed).
- Write audit entries **in the same transaction** as the mutation they describe. Minimum audited actions: sign-ins (staff), role changes, application decisions, appeals, conversions, deposits, releases, refunds, adjusts, gate decisions, acceptance signatures, People replies, publishes, settings changes, backups, purges.

## §7 Seeds (idempotent, `pnpm seed` / `pnpm seed:demo`)

| Source (in `design-reference/`) | Target | Expected counts |
|---|---|---|
| `kayan-registry*.js` (load all 4 in order → `KAYAN_REGISTRY`) | spec_families, specs, banks, wallets, languages, governorates, consents, doc_kinds | 20 families / **455+ specs** (6,800+ micro in `specs.micro`) / 16 banks / 6 wallets / 19 languages / 23 governorates / 13 consents (9 required) / 8 doc kinds |
| `rp-core.js` + `rp-fixed.js` + `rp-range.js` | products | all catalogue items, `status='published'` |
| People page (POS-01..03) | positions | 3 open positions with location + salary band |
| Admin settings cards | settings | `sla.doors={clients:3,talent:5,applications:7}` (working days) · `auth={otp_ttl_min:10,lockout:{fails:5,minutes:15},staff_session_hours:8,totp:'mandatory'}` · `payout={banks:'primary',wallets:'capped',cash:'never'}` · `backup={schedule:'02:00'}` · `locale={source:'ar',secondary:'en',tz:'Asia/Aden'}` · `whatsapp_number` |
| — | feature_flags | `atlas=true`, `dimension=true`, `maintenance=false` |

**Demo fixtures** (`SEED_DEMO=true` only; production boot refuses the flag): demo client `client@demo.kayan` / demo talent `talent@demo.kayan` (password `kayan2026`, Argon2id-hashed; registry ids per README), one staging engagement KY-J-26-00417 with pod POD-26-041 (lead سلمى العمودي, T3), the admin sample queues. Demo OTP `2026` exists only behind `DEMO_OTP=true` (staging).

## §8 Migration discipline

Migrations are generated by drizzle-kit, reviewed by hand, committed, and applied by the container entrypoint (`migrate-then-start`, advisory-lock guarded so app+worker don't race). Never edit an applied migration; never `db push` outside local dev. Destructive changes need a two-step (expand → migrate data → contract) across deploys. Every migration runs inside a transaction.
