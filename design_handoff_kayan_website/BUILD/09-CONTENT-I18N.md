# 09 — CONTENT & I18N: Arabic source, English secondary

## §1 The language model

- **Arabic is the authored source.** Every design was written in Arabic first, in the administrative/contracting register. English restates; it never leads. Visually: English lines are smaller and lighter (Instrument Sans, reduced opacity) — preserve that hierarchy in every component.
- Locales: `ar` (default, RTL) and `en` (LTR). `<html lang dir>` always correct per rendered locale.
- **The K4Y exception is deliberate**: the Civic Wing page shows inline AR/EN span pairs and persists its own `k4y-lang` preference, independent of the site-wide language. Port it as designed; comment the exception in code.

## §2 URL strategy & locale resolution

Two mechanisms, both from the designs — do not unify them:

1. **Toggle pages** (Home, Charter, Access, Portal, Spaces, Apply, People, Planet, Journey, Legal…): one URL, language switched in place. Server resolves locale: `kyn_lang` cookie → `Accept-Language` → `ar`. The toggle sets the cookie (1 year, `SameSite=Lax`, not HttpOnly — client reads it) and re-renders (`router.refresh()`); no URL change, exactly like the designs' `kyn-lang` behavior.
2. **Twin pages** (the three Lines, which shipped as separate AR/EN documents): real routes — `/lines/delivery` ↔ `/en/lines/delivery`, `/lines/hub` ↔ `/en/lines/hub`, `/lines/forge` ↔ `/en/lines/forge`. Cross-link with `hreflang` pairs; the language toggle on these pages navigates between twins and also sets the cookie.

`kyn_lang` is the ported name of the designs' `kyn-lang` localStorage key. Cookie (not localStorage) so SSR renders the right language on first byte. Admin console is Arabic-only (as designed); no toggle.

## §3 Where copy lives

- **Page copy stays colocated** with the page component as typed constants `{ ar, en }` — the designs are page-shaped documents, not string soup; a shared messages catalog would shred their voice. Shared strings (nav, footer, form errors, empty states) live in `src/i18n/ar.ts` / `en.ts` (next-intl catalogs).
- **Keyed errors**: Access/Apply already define AR/EN error pairs per code — port them as a typed map `{code: {ar, en}}` shared by client and API (the API returns `message_ar`/`message_en` from the same map; `04-API.md §1`).
- **DB-held content** (products, announcements, positions, consents, registry names) carries `*_ar` and `*_en` columns; `_en` may be empty where the design shows none.

## §4 Copy extraction rules (binding)

1. Extract character-for-character from the design files — including punctuation, «guillemets», spaces before units, and Western numerals. No "fixing", no re-wording, no added تشكيل.
2. Write `scripts/extract-copy.ts`: parses each design file's `<x-dc>` template, dumps visible text nodes (order-preserving, whitespace-normalized) to `copy-baseline/<page>.txt`. The fidelity gate (`10-QA-ACCEPTANCE.md §2`) diffs rendered pages against this baseline — the diff must be empty for ported copy.
3. Strings assembled in the designs' logic classes (counters, dates, receipt lines) are templates: extract the surrounding literal text exactly and parameterize only the value.
4. Do not translate AR-only sections into English "for completeness". If the design shows no English, there is none.

## §5 Writing NEW lines (only when unavoidable)

`../ARABIC-COPY-RULES.md` is binding. Summary of the law: verb-led, usually passive («تودع»، «يصرف»، «لا يجوز»); compact; no «تم + مصدر»; no تشكيل or tanween; no exclamation marks; real contracting terms (حساب الضمان، محضر الاستلام، أمر تغيير، قرار مسبب، جهة تزكية). Test: could the line appear unedited in a Yemeni/Gulf contract or bank notice? If you cannot meet the bar, ship `COPY-TODO(<context>)` in the code, list it in `PROGRESS.md`, and use a neutral minimal line meanwhile. Never block a session on copy.

New-screen copy that IS required and must be written to standard during the build: password reset + email verification screens, 404/500, email templates (`§8`), admin detail views (`06-ADMIN.md §6`) — derive tone from the nearest existing design.

## §6 Fonts & subsets (self-hosted, `next/font/local`)

Download once from Google Fonts, commit woff2 to `public/fonts/`, delete every Google `<link>`. Budget: **≤ 380 KB total** woff2 on first visit.

| Family | Files | Subsets | Used for |
|---|---|---|---|
| Alexandria | `alexandria-ar-var.woff2` (wght 100–900), `alexandria-latin-var.woff2` | arabic / latin split by `unicode-range` | Display + headings (hero weight 200; bold spans 700–800) |
| IBM Plex Sans Arabic | 400 / 500 / 600 / 700 static | arabic+latin-core | Arabic body (13–15px, lh 1.95–2.15) |
| Instrument Sans | `instrumentsans-var.woff2` (400–700) | latin | English secondary register |
| IBM Plex Mono | 400 / 500 / 600 | latin | Kickers, codes, ledger numbers — always `dir="ltr"` |

Rules: `font-display: swap`; preload exactly two files (Alexandria ar-var + Plex Sans Arabic 400); `unicode-range` arabic `U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF` and latin `U+0000-00FF, U+2010-2027, U+2030-205E`; subset with `pyftsubset`/`glyphhanger` keeping Arabic presentation forms. Fallback stacks: `"Alexandria", "IBM Plex Sans Arabic", system-ui, sans-serif` (display), `"IBM Plex Mono", ui-monospace, monospace` (mono).

## §7 Numerals, dates, BiDi

- **Western numerals everywhere** (٠١٢٣ never appear in the designs). Currency `$1,200`; thousands with commas.
- Dates in UI follow the designs' format (`02 AUG`, `17 AUG` mono/uppercase in ledgers; long-form Arabic dates in prose where designed). Timezone Asia/Aden for display; UTC storage.
- Any Latin/code run inside Arabic prose (IDs `KY-J-26-00417`, emails, URLs, `$600`) is wrapped in BiDi isolates `\u2066…\u2069` (LRI/PDI) — otherwise codes reorder mid-sentence. Provide `<Code>` component + `isolate(str)` helper; grep-gate in QA.
- Mono blocks and inputs for codes/dates: `dir="ltr"`; date inputs `direction:ltr; text-align:right` (as designed).

## §8 Email i18n

Every outbound mail: Arabic body leads (RTL table layout), English restates below, smaller/lighter; subject carries the registry number first: `‏KY-T-26-00219-4 — قُبل طلبك في سجل المواهب`. Templates in `server/mail/templates/` as typed functions returning `{subject, html, text}`; no remote assets (inline logo as attached PNG or data URI); plain-text alternative always. Client-matrix smoke per `01-SESSIONS.md` S10.

## §9 Canonical glossary (use these, never synonyms)

| Arabic | English | Code meaning |
|---|---|---|
| حساب الضمان | escrow account | `escrow_entries` |
| محضر الاستلام | acceptance record | signed acceptance releasing funds |
| أمر تغيير | change order | `change_orders` |
| نطاق العمل | scope of work | `client_files.scope` |
| وثيقة فتح النطاق | scope-opening file | the Portal client file (KY-F) |
| جهة تزكية | reference | `ref_checks` |
| قرار مسبب | reasoned decision | mandatory written refusal reason |
| لجنة الالتزام | compliance committee | staff role `compliance` |
| أمين السجل | registrar | staff role `registrar` |
| أمين الضمان | escrow officer | staff role `escrow` |
| مشرف التسليم | delivery supervisor | staff role `delivery` |
| مكتب العملاء | client desk | staff role `clientdesk` |
| مكتب الناس | people desk | staff role `people` |
| محرر المحتوى | content editor | staff role `editor` |
| مدقق قراءة | read-only auditor | staff role `auditor` |
| مدير النظام | system administrator | staff role `sys` |
| بوابات الجودة | quality gates | G0–G9 |
| الفريق / الفرق | pod / pods | execution units |
| سلم الثقة | trust ladder | tiers T0–T4 |
| ترشح | job application | People desk APP- |
| السجل | the registry | the institution speaking in People replies |

Tagline, verbatim, never restyled: «خلف كل نجاح، كيان» — *Behind every success, a Kayan.*
