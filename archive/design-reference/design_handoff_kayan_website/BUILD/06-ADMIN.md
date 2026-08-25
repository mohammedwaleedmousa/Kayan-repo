# 06 — ADMIN: the staff console (admin.kayanwork.com)

`Kayan Admin.dc.html` is the pixel- and copy-exact design of the whole console: gate screen, shell, ten views, RBAC states. Port it first, then add the §6 detail views in the same vocabulary. Everything here is server-enforced (`04-API.md §12`); the design's role-switcher select exists **only** behind `STAFF_PREVIEW=true` on staging — in production the role comes from the session.

## §1 Access & shell

- Host-gated: only `admin.kayanwork.com` serves it; the public host 404s `/admin/*` (middleware). `noindex`.
- Sign-in gate (as designed, dark `#03201D`): email + password → mandatory TOTP. Lockout 5/15 min; sessions 8h absolute / 60 min idle; optional `ADMIN_IP_ALLOWLIST`.
- Shell: right sidebar (RTL) — brand mark, three nav groups exactly as designed: **العمليات** (نظرة عامة، سجل المواهب، ملفات العملاء، الضمان والارتباطات، الفرق والبوابات) · **المكاتب** (الناس والرسائل، المحتوى) · **الحوكمة** (الحسابات والأدوار، سجل التدقيق، الإعدادات). Live queue badges on nav items. Header: breadcrumb mono kicker (`ADMIN / …`), page title, staff name + role label, logout.
- Staff identity: `ADM-YY-NN`, name, one of the nine roles. Header shows «تعرض بصلاحيات» only in staging preview.

## §2 The nine staff roles (keys are code-level constants)

| Key | Arabic (verbatim) | Charge |
|---|---|---|
| `sys` | مدير النظام | everything, incl. users + settings |
| `registrar` | أمين السجل | talent registry: review + approve/issue numbers |
| `clientdesk` | مكتب العملاء | client files: review + convert to engagements |
| `escrow` | أمين الضمان | deposits, releases, refunds, payout batches |
| `delivery` | مشرف التسليم | pods + quality-gate approvals |
| `compliance` | لجنة الالتزام | refusals with reasoned decisions + appeals |
| `people` | مكتب الناس | People desk: applications + registry inbox replies |
| `editor` | محرر المحتوى | products + announcements publishing |
| `auditor` | مدقق قراءة | read-only everything; no mutations at all |

## §3 The 12-capability matrix (verbatim from the design; `domain/rbac.ts`; ✓ = allowed)

| # | Capability (Arabic verbatim) | sys | registrar | clientdesk | escrow | delivery | compliance | people | editor | auditor |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | قراءة لوحات التشغيل | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 1 | مراجعة طلبات المواهب | ✓ | ✓ | — | — | — | ✓ | — | — | — |
| 2 | قبول طلب وإصدار رقم | ✓ | ✓ | — | — | — | — | — | — | — |
| 3 | رفض بقرار مسبب / تظلمات | ✓ | — | — | — | — | ✓ | — | — | — |
| 4 | مراجعة ملفات العملاء | ✓ | — | ✓ | — | — | — | — | — | — |
| 5 | تحويل ملف إلى ارتباط | ✓ | — | ✓ | — | — | — | — | — | — |
| 6 | صرف من حساب الضمان | ✓ | — | — | ✓ | — | — | — | — | — |
| 7 | اعتماد بوابات الجودة | ✓ | — | — | — | ✓ | — | — | — | — |
| 8 | الرد باسم السجل | ✓ | — | — | — | — | — | ✓ | — | — |
| 9 | نشر المحتوى | ✓ | — | — | — | — | — | — | ✓ | — |
| 10 | إدارة الحسابات والأدوار | ✓ | — | — | — | — | — | — | — | — |
| 11 | تعديل الإعدادات | ✓ | — | — | — | — | — | — | — | — |

Separation-of-duties this encodes (keep sacred): the registrar **cannot refuse** (only compliance can); compliance **cannot approve**; the escrow officer is the only money-mover; delivery alone passes gates; nobody but `sys` touches users/settings. **Denied state in UI = the design's disabled treatment** (button present, muted, with the explanatory line) — never hidden, and the API still 403s (`capability_denied`).

## §4 Cross-view furniture

Status chips (gold=ready/awaiting, mint=in-progress/ok, warn=deficient/refer); selected row `border #C9A227 / bg #FFFDF4`, default `#E3D9C2 / #F4EEDD`; two-pane pattern (queue right, detail left in RTL); mono for every id/amount/date; all times Asia/Aden.

## §5 The ten views (data + actions; demo rows in the design = shape reference)

1. **نظرة عامة (overview)** — 6 KPI cards: طلبات قيد المراجعة (+oldest age)، ملفات نطاق مفتوحة (+awaiting deposit)، أرصدة محتجزة (+engagement count)، طلبات اعتماد بوابات، رسائل قرب الاستحقاق، ضمانة سارية. Queue list (5 rows → deep-link to views). Audit feed (latest 5, link to سجل التدقيق).
2. **سجل المواهب (talent)** — queue: id, name, spec (name + code), stations `n/14`, chip (جاهز للقرار/نواقص/قيد التحقق), meta. Detail pane: 5 verification axes with bars + values, actions **قبول وإصدار الرقم** (cap 2) / **رفض بقرار مسبب** (cap 3) / طلب استكمال (cap 1). Approve modal confirms the KY-T number to be issued; refuse modal REQUIRES the written reason. The detail pane also carries ref-check marking (وردت / تعذر الوصول — cap 1) and reasoned tier changes T0–T4 (cap 2, audited).
3. **ملفات العملاء (clients)** — queue: KY-F, org, line, budget, chip (بانتظار التحويل/بانتظار الإيداع/قيد الاكتمال n/5/إحالة إلى K4Y). Detail: scope text, contact, compliance state; actions **تحويل إلى ارتباط** (cap 5 — opens convert form: title/line/price/deadline/DoD/pod+lead), إحالة إلى الجناح المدني, رفض بقرار مسبب.
4. **الضمان والارتباطات (escrow)** — engagements table: KY-J, org, pod, held, released, stage. Detail: full ledger (memo lines verbatim), balance; actions **تسجيل إيداع** / **أمر صرف** (cap 6; release picker shows only deliverables whose محضر is signed; shows the 3 preconditions with live check state), refund/adjust behind CO.
5. **الفرق والبوابات (pods)** — table: POD code, KY-J, current gate, checks n/5, request state (بانتظار الاعتماد/لا طلب — الفحوص ناقصة/مقفل — ضمانة سارية), lead. Detail: G0–G9 rail, the 5 quality checks with state, **اعتماد العبور** / **إعادة للفريق مع ملاحظة** (cap 7; approve disabled until server confirms 5/5). Also under this view (cap 7): calls-for-pods CRUD with interest lists, and pod membership/split edits (lead stays T3/T4).
6. **الناس والرسائل (people)** — two stacks: ترشحات (APP id, name, position, SLA due chip) and بريد السجل (REG id, door, subject, due). Reply composer stamps the number + promised date; overdue rows warn-chipped (SLA job). Third block (cap 8): **الوظائف المفتوحة** — vacancy CRUD (POS-…; location + salary band mandatory; ≥ 14 days open enforced — business rule 9) and verified K4Y-hours entry.
7. **المحتوى (content)** — Ready Products table (code, name, price, منشور/مسودة) + announcement editor. Pipeline: مسودة → مراجعة → **نشر** (cap 9, audited, publishes to the public site immediately).
8. **الحسابات والأدوار (users)** — staff table (name, role, 2FA state, last login), **the capability matrix rendered live from `domain/rbac.ts`** (never a hardcoded copy), invite/role-change/suspend (cap 10, audited, TOTP enrollment enforced on first login).
9. **سجل التدقيق (audit)** — filter chips (الكل/الضمان/السجل/البوابات/الدخول والحسابات), rows: time, actor (`registrar·s.awlaqi` format), verb-led Arabic action line, object table, hash link `9f2c…→b7a1`. **تحقق من السلسلة** button → chain verify result.
10. **الإعدادات (settings)** — six cards verbatim: مهل الرد (SLA) · الدخول والأمان · قنوات الصرف · النسخ الاحتياطي (last backup / last tested restore) · أعلام الميزات (الأطلس، الرحلة، وضع الصيانة) · اللغة والتوقيت. Editable per cap 11; **danger zone** (channels, maintenance, flags) requires TOTP step-up.

## §6 Derived detail views (not in the design file — build in its exact vocabulary)

1. **Talent file review** (from view 2): full 14-station read-out, uploaded docs viewer (private streaming), ref-check states, application events timeline, decision panel. Shows the **purge notice**: «تحذف صور الهوية بعد البت ويحتفظ بالبصمة» — and the purge state once run.
2. **Client file detail**: all 5 steps, proof docs, OTP verification state, conversion history.
3. **Engagement detail**: deliverables board — created at convert (amounts sum to price), delivery moves wip→review, **only the client authority accepts** — plus change orders, staff-side messages composer (cap 4, SSE to the Space), files, warranty countdown, payout batches born from each release.
4. **Appeal review** (compliance): refusal reason shown, grounds, window countdown, decide panel (reason mandatory again).
5. **Payout batches**: per release — talent rows, channel, amounts (split by `pods.split`), status trail pending→instructed→confirmed, **CSV export**; decrypted account details visible only to cap 6, access audited.
6. **Backup status** (in settings): history table from `backups`, last restore drill date, run-now.
7. **Login history** (in users): staff sign-ins, IP, TOTP result, lockouts.
8. **Staff invite flow**: invite mail → set password → TOTP enroll (QR + backup codes shown once) → active.

## §7 Workflows (server-side state machines; every transition audited)

- **Approve talent**: `submitted/in_review → approved` — issue KY-T (counter + check digit), create profile (T1), send decision mail, schedule ID-image purge. Irreversible; audit carries the issued id.
- **Refuse talent**: reason ≥ 20 chars mandatory → `refused`, decision mail with the reason + appeal rights, appeal window = 21 days (job closes it). Appeal upheld ⇒ back to `in_review` with note; denied ⇒ final.
- **Convert client file**: `submitted → converted` — creates engagement (KY-J) + pod (POD, lead T3/T4 enforced) + escrow awaiting deposit; client notified with deposit instructions.
- **Deposit / release / refund / adjust**: cap 6 + Idempotency-Key; release preconditions per `04-API §12`; every entry lands in the client's live ledger via SSE.
- **Gate approval**: pending request + server-verified 5/5 → advance `current_gate`, notify pod room live; decline requires a note back to the team.
- **People replies**: reply body → mail from the registry (REG/APP number in subject), SLA timer closed, row `replied`.
- **Publish**: editor drafts → review → publish (audited); products flow to `/lines/products`, announcement to the site bar.
- **Users**: invite → role change → suspend; cannot demote/suspend the last active `sys`.
- **Settings**: value changes audited with before/after payload; danger zone step-up.

## §8 Automation feeding the console (jobs — `02-ARCHITECTURE §5`)

SLA scan flags due-soon (48h) and overdue rows (the design's «يستحق …» chips); warranty expiry closes engagements (ledger must be zero — else alarm row in overview); appeal windows expire; purge job reports into the talent detail; nightly backup writes the settings-card row; dormancy tier-drops write reasoned audit lines; weekly digest mails each desk its queue summary.

## §9 Fidelity notes

Console is Arabic-only, RTL, cream-on-dark shell exactly as designed (sidebar `#03201D`, content on `#F4EEDD`); no dark-mode variants; numerals Western; every table row mono-ids; empty queues get the designed empty states (build them from the design's vocabulary where the demo data hides them — flag in review). The role-preview select from the design ships **only** on staging (`STAFF_PREVIEW=true`).

Scope decision (deliberate, documented): registry reference data — families/specs/banks/wallets/languages/governorates/consents/doc kinds — is **seed-managed in v1** (changed by migration + reviewed seed, not by console); everything else an operator must ever touch is reachable from these ten views. Coverage audit: every dynamic surface on the 27 pages — announcement bar, products, positions, applications, files, engagements, deliverables, escrow, pods, gates, calls, messages, replies, tiers, K4Y hours, users, settings, flags, backups — has exactly one owning view and capability above; nothing is orphaned, nothing is duplicated.
