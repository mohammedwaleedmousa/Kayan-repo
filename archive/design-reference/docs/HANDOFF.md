# KAYAN — Developer handoff (Claude Code)
Compiled 2026-08-11 · updated 2026-08-14 (auth + logged-in spaces + pod room + people + planet). Everything here is live in the project; paths are project-relative.

## What this is
Kayan's public site + working-model portals, built as self-contained `.dc.html` pages (open directly in a browser). Arabic is the source language (admin/contracting register — see CLAUDE.md rules); English is secondary. Brand: dark green + cream + gold, bird mark, tagline «خلف كل نجاح، كيان».

## Final page map (everything else is draft/archive)
| File | Role | Lang |
|---|---|---|
| Kayan Home.dc.html | Landing: hero + map, lines (bird picker), charter invite, doors | AR/EN toggle |
| Kayan Charter.dc.html | من نحن + mission/vision + 4 articles (governing text) | AR/EN toggle |
| Kayan Journey.dc.html | Engagement lifecycle: SOW → escrow → delivery → acceptance | AR |
| Kayan Apply.dc.html | Talent registration, 14 stations (see contract below) | AR |
| Kayan Portal.dc.html | 3 doors: client (5-step scope form + dashboard), talent dashboard, pod room (gated) | AR |
| Kayan for Talent.dc.html / Kayan for Clients.dc.html | Audience pitches | AR |
| Line I - Managed Delivery(.| EN).dc.html | Outcome model, price floor | AR+EN files |
| Line II - The Hub and Cafe(.| EN).dc.html | Hub: membership (monthly, $20 = 30,000 YER), solar/green policy | AR+EN files |
| Line III - The Forge(.| EN).dc.html | Talent foundry: 9-stage cohort machine, trust ladder, sponsors | AR+EN files |
| Kayan Atlas.html | PLAIN HTML (maps skill): d3 + world-atlas TopoJSON, Yemen gold-lit, REAL astronomical day/night terminator redrawn every minute on Aden time, animated delivery arcs Aden→world, hoverable city points (7 Yemen + 7 destinations), HUD chips (Aden clock, subsolar point). Linked from Home Ground section (افتح الأطلس الحي). | AR + EN mono |
| Kayan Dimension.html | PLAIN HTML 3D scroll voyage (pinned three.js import map): damped scroll camera rail through lighthouse → 10 gates (G0–G9 plates + live HTML gate captions) → escrow vault → pod constellation → sun finale with brand-bird sprite flight; per-chapter fog/background color grading, vignette + gold progress hairline, chapter rail + ArrowUp/Down/PageUp/Down nav, reduced-motion + WebGL fallback. Parallel experience — classic site untouched, cross-linked in Home nav (الجولة المجسمة 3D). | AR + EN mono |
| Civic Wing - Kayan for Yemen.dc.html | K4Y civic wing (internal data-ar/data-en spans) | AR/EN inline |
| Kayan Access.dc.html | Unified sign-in/sign-up, FULLY BILINGUAL (kyn-lang toggle, keyed errors AR/EN, Enter-to-submit, gold departure wipe to the right Space) | AR/EN |
| Kayan Space - Client.dc.html | Client dashboard post-login: stage rail, escrow ledger, deliverables + acceptance signature (releases escrow, starts warranty), change orders, messages, docs, settings | AR |
| Kayan Space - Talent.dc.html | Freelancer dashboard post-login: trust ladder, availability, my pods, calls for pods, earnings, delivery record, 5 verification axes, K4Y hours, weekly readiness | AR |
| Kayan Pod Room.dc.html | Pod workspace: gated by talent session + pod/job code; gate rail G0–G9, 4-lane task board, delivery journal, team channel, quality-guard checklist (unlocks gate request), files + fixed split | AR |
| Kayan People.dc.html | Careers: 5-rule work charter + K4Y civic-hours strip, 12-week internship (4 tracks, PH-INT-STIPEND, W01–W12 phase arc), 3 open positions (POS codes + bands, in-page form + mailto fallback), دفتر الناس metrics (source + quarter stamps, no fake bars), filed-applications receipt strip, registry-office contact form | AR |
| Kayan Planet.dc.html | Environment: LIVE footprint meter (real transferSize × SWDM v4: 0.81 kWh/GB, 494 g/kWh; grade bands; 1 g/view budget), 6 operational commitments with proof lines, 7 SDG mappings, Yemen recovery/stabilization alignment (no invented partners) | AR |

Deleted (do not resurrect): `Kayan Site.dc.html` (old all-in-one draft), `Civic Wing … EN` (empty shell). Archived to `scraps/` 2026-08-14: `Canvas*.dc.html`, `probe.html`, `kayan-map-hero.html`. `The master one.dc.html` stays — live master identity doc (linked from Dossier). `Kayan Hub.html` stays — location/map page linked from Line II.

## Shared runtime files
- `kayan-registry.js` + `kayan-registry-2/3/4.js` — load ALL FOUR in order. `window.KAYAN_REGISTRY` = { meta, banks[16] (CBY-Aden licensed, sanctions-screened), wallets[6]+walletNote, languages[19], langLevels (CEFR+N), langProof (self/cert/kayan), governorates[23], idTypes, refRelations+refRules, consents[13] {t,b,req}, docKinds[8], families[20] {c,a,e,specs:[{a,e,m[15+]}]} } — 455+ specs, 6,800+ micro-specs. Codes: family `c` is 2 letters; spec code = `c`-NN by array order.
- `yemen-map.js` — canvas map web component (Aden HQ, routes to London/Riyadh; NYC removed).
- `support.js` — DC runtime (never edit).
- `assets/` — birds & logos. Canonical: `kayan-logo-gold.png` (header lockup), `kayan-bird-elite-gold.png` (hero/site bird), `kayan-mark-cream.png` (footer), per-line birds `bird-md/hub/forge/k4y.png`, hub hero `hub-bird-coral.png` (masked radial fade).

## Client doctrine — one key, one document (no duplicate forms)
- `Kayan Access` owns the ACCOUNT (credentials → session `kyn-auth-v1`). `Kayan Portal → capply` owns the REQUEST (وثيقة فتح النطاق: org, authority+proof+phone OTP, compliance, scope → `kyn-portal-v2.c`). They are different instruments, not rival sign-ups.
- Bridges (live): Portal client door with session + no submitted file → opens capply PREFILLED from the session (org/name/email) with a session strip linking back to the Space; Access sign-up prefills email/org/name from a draft `kyn-portal-v2` file. Server later ties file↔account by email.

## Data contracts (localStorage)
- `kyn-contact-v1`: `{v:1, last:{id:'REG-26-…', door, due, at}, list:[{…, name, chan, msg, doorKey}]}` — People registry-office contact form: door pick (people/intern/media/other) → SLA shown BEFORE send (3–5 working days) → receipt number + promised reply date. Server later: route by doorKey to the right inbox.
- `kyn-people-apps-v1`: `{v:1, sent:{<POS code|GEN-POOL>:{id:'APP-…', name, contact, note, at}}}` — People page in-page application form (per-job + readiness pool). Buttons flip to رشحت ✓ / ملفك محفوظ ✓; mailto kept as secondary channel. Server later: POST to HR inbox.
- `kyn-lang`: 'ar' | 'en' — read by Home/Charter toggles. Any new page must honour it.
- `kayan-apply-v1`: registration draft/submission. Shape: `{v:1, stage, maxSeen, ack[6], termsDone, honesty, q1,q2, acc{name,wa,email,pw,codeSent,code,codeOk}, idn{legal,dob,sex,nat,gov,city,country,type,num,exp,frontOk,selfie,selfieChecks,selfieOk}, prof{edu,years,status,hours,device,net,power,backup}, specs[{fi,si,fam,famC,name,en,micros[],rating}] (max 5, [0]=primary), langs[{lang,level,proof,cert}], docs[{kind,issuer,year,file,size}], links[], pod{on,name,members[{name,wa,role}],split}, k4y{on,fields[],hours,govs[],prior,why}, refs[{name,rel,org,phone,email,work,status}] (2–3, statuses: مسودة/أرسل الطلب/وردت الإفادة), pay{banks[],accs{bank:{name,num,branch}},wallets[]}, consents[13], submitted, appId, submittedAt}`. Demo OTP: `2026`.
- `kyn-portal-v2`: `{v:2, view:'enter|capply|client|talent|pod', c:{stage,maxSeen,submitted,id,org{...},auth{...,proofOk,codeOk},comp[4],final,scope{outcome,line,deadline,budget,desc,files[]},prog:0–5,accepted,acceptDate,warrantyEnd,log[]}}`. Portal READS kayan-apply-v1 (talent door + pod path B). Pod room opens only when `c.submitted && c.prog>=3`.
- ID format: `KY-T-26-#####-C` (talent), `KY-C-26-#####-C` (client). Check digit: weights [8,7,6,5,4,3,2] over 7 digits, `(11−sum%11)%11`, 10→'X'.
- `kyn-accounts-v1`: `{v:1, clients:[{id,name,org,email,pw,at}], talents:[{id,name,email,pw,tier,spec,at}]}`. Seeded demo: `client@demo.kayan`/`kayan2026` (KY-C-26-00417-8, مؤسسة الميناء للتجارة) and `talent@demo.kayan`/`kayan2026` (KY-T-26-00088-1, سلمى العمودي, tier 3). Talent sign-in also accepts a submitted `kayan-apply-v1` (acc.email + acc.pw) and migrates it into accounts. REPLACE pw storage with real hashing server-side.
- `kyn-auth-v1`: session `{v:1, role:'client'|'talent', id, name, org, email, tier, at}` — written by Access, read by both Spaces (redirect panel to Access when absent/wrong role), Pod Room, and Portal doors (route straight to Spaces when a session exists). Logout removes it.
- `kyn-cws-<clientId>`: client workspace `{v:1, jobId:'KY-J-26-00417', scopeTitle, pod, lead, price, deadlineTs, stage 0–5, dod[], ledger[], held, deliv[{id,name,note,st:'wip|review|accepted'}], cos[], msgs[], log[], accepted, warrantyEnd}`. Acceptance = typed signature name → releases $600 (or full remainder on last item) from escrow, logs, stage→5 + 30-day warranty when all accepted.
- `kyn-tws-<talentId>`: talent workspace `{v:1, avail, week[7], applied[]}` (calls-for-pods interest).
- `kyn-pod-041`: pod state `{v:1, deadline, gate:6, checks[5], gateAsked, tasks[{id,t,lane 0–3,owner}], log[], chat[], files[]}`. Room unlock: talent session + code `POD-26-041` or `KY-J-26-00417` (sessionStorage `kyn-pod-open`). Board lanes: تجهيز/تنفيذ/مراجعة داخلية/مقبول; moving into lane 3 auto-logs; all 5 guard checks → gate-request button arms (kGlow pulse).

## Design tokens (inline styles only — no stylesheets beyond helmet resets)
- Surfaces: deep `#03201D`/`#052E2B`, cream `#F4EEDD`/`#FAF6EC`/`#EDE5D2`, card border `#E0D6BD`/`#E3D9C2`.
- Gold: `#C9A227` → `#E9C96B` (gradients 135deg), deep gold text `#8F7218`. Teal action `#0E6E66`. Client-blue `#2E7CBC` on `#0A2434`. Pod-purple `#5B4A8E` on `#1D1433`. K4Y green `#2F6B3A`.
- Type: Alexandria (display), IBM Plex Sans Arabic (body AR), Instrument Sans (body EN), IBM Plex Mono (codes/labels). Mono labels ALWAYS `dir="ltr"`, letter-spacing .16–.24em.
- Motion: reveal-on-scroll (`[data-reveal]` + IntersectionObserver + 2.6s failsafe), `kIn` view transitions, hover lift on `[data-card]`, `prefers-reduced-motion` kill-switch everywhere.
- RTL-first: `dir="rtl"` root; EN blocks wrapped `dir="ltr"`. Inputs: dates `direction:ltr;text-align:right`.

## Business rules encoded in UI (do not weaken)
1. لا عقد، لا ضمان، لا عمل — enforced in portal stage gating (escrow before execution).
2. Verification ≠ assignment (Apply station 00 comprehension quiz + talent dashboard copy).
3. Acceptance gate: only client authority signs; signature releases escrow; 30-day warranty.
4. Negative decisions are human-signed with written reason; one appeal within 21 days.
5. ID document images deleted after verification (hash retained) — consent #2.
6. Payouts via official channels only (banks primary, wallets capped secondary); data used at first payout only.
7. Pods = execution units for live engagements; no waiting rooms. Ready-pods register via Apply station 07, activate on first assignment.
8. Consents: 9 required + 4 optional, individually ticked; charter scroll-to-end unlocks honesty pledge.

## Arabic rules (CLAUDE.md is binding)
Verb-led passive admin register; no «تم + مصدر»; no تشكيل; no exclamation marks; real industry terms (حساب الضمان، محضر الاستلام، أمر تغيير، جهة تزكية، قرار مسبب). English never leads. Test: could the line sit in a Yemeni/Gulf contract unedited?

## Outstanding work (priority order)
1. Server wiring for auth (hash passwords, real OTP email/WhatsApp), messaging, file upload (pod room + client docs), payout rails. All UI states already exist behind localStorage contracts above.
2. EN editions: Home/Charter/Access fully bilingual via `kyn-lang`. People/Planet carry EN secondary hero lines; Spaces/Pod Room use the EN-mono secondary register (kickers/labels). Full EN toggles for the working surfaces only if the owner asks.
3. Balagha stylistic pass per page (mechanical sweeps already clean).

- Cursor signature: `[data-sheen]` gold radial highlight tracking the pointer on primary CTAs (People has the pattern + one shared pointermove listener; hover-only, reduced-motion silent). Roll out to other pages' primary CTAs when touching them.

### QA 2026-08-14 (full-site deep test)
- Wiring: all 26 final pages audited — 0 broken hrefs/srcs (uploads/ + assets/ + root all resolve).
- Console: 26/26 pages load clean. Two benign warnings only: THREE.Clock deprecation (Dimension); transient `{{ o }}` first-paint diagnostic (for Clients — select verified rendering populated).
- Storage contracts cross-checked against pages that read/write them (map below is current).
- Known fragility: Home hotlinks 7 Wikimedia Commons images — mirror locally in production. Civic Wing uses `k4y-lang` (deliberate sub-brand key, separate from `kyn-lang`).

### Done 2026-08-14
- Unified access page + seeded demo accounts; client sign-up = org + signing authority + OTP; talent sign-up routes through Apply (verification ≠ form) with quick sign-in for submitted files.
- Client Space, Talent Space, Pod Room, People, Planet built (see page map). Pod lead consistency: سلمى = T3 everywhere (leads must be T3/T4).
- Portal doors rewired: session-aware (straight to Spaces), pod door → Pod Room page, unified-access strip added. Home footer + People/Planet/Access links.
- Escrow release math: per-item $600, final item releases remainder — ledger always zeroes out.
- People page upgrades: 12-week arc (4 phases, 4-across ≥860px / stacked below), دفتر الناس bars replaced with source+quarter stamps, أرقام ترشحك strip surfaces APP-IDs from kyn-people-apps-v1.

### Done 2026-08-11
- Bird audit vs uploaded references: all in-use birds match (MD blue / Hub gold / Forge ember / K4Y green / RP teal / hero elite-gold per owner directive).
- Line III Forge AR built (`Line III - The Forge.dc.html`): full RTL mirror, Arabic-authored copy, same ember canvas + anvil strike + card flip engine; compass line3 now paired AR/EN; EN page عربي pill → AR file; Home forge card + footers relinked.
- Header unification: Journey got the gold-lockup header; Talent/Clients already had it.
- Home line panel: شعاب-عدن card treatment (side accent border per line color).
- Site-wide link audit: only break was Home → deleted Civic Wing EN shell; fixed (both href+altHref → inline-toggle Civic page).

## Gotchas
- `.dc.html` pages stream: keep inline styles, `hint-*` attrs on sc-for/sc-if, no class-based CSS.
- `kayan-registry.js` is ~190KB; registry-2/3/4 top up 9 families — never re-append to file 1 (sandbox write cap).
- Old `Kayan Site.dc.html` links are all remapped; grep for `Kayan Site` before adding any.
- Verifier flags: liveness camera needs user permission — upload fallback exists; FaceDetector API optional (falls back to human-review flag).
