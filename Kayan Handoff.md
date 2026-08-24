# Kayan — Handoff Brief
_Written 6 Aug 2026. Read this first in any new chat. It carries the state, the decisions, and the reasoning behind them._

---

## 0. Built since this brief was written

**Standing rule from the owner: `The master one.dc.html` accumulates everything.**
Every artifact built from now on gets (a) its own `.dc.html` so it can ship standalone, and
(b) a numbered section in the master that mounts it live via `<dc-import name="…">`, plus a row in
the **الفهرس / Manifest** section with its status. Nothing is considered delivered until it is in the
manifest. The manifest sits directly after the cover; new chapters are added before `#map` (الحوكمة).

### Turn 4 — applied identity: print pack and social system
- **`Kayan Stationery.dc.html`** — six A4 pages on `doc-page`, print-ready as authored: cover/index, letterhead (a usable A4 sheet with a real خطاب تكليف specimen), business card front/back at 1:1 with bleed box and corner marks, staff ID (CR80 portrait) front/back, DL envelope + compliment slip at 80%, and a print specification (approx. CMYK per colour, stock and finish per piece, ±1mm trim tolerance, 3mm bleed / 4mm safe, PDF/X-4, fonts outlined). Export via `show_pdf_export_dialog` — no further print work needed.
  - The business-card **back carries the holder's record URL** (`kayanwork.com/v/PH-ID`), not a slogan block. The card points at the register; that is the whole thesis in one artefact.
  - The **staff ID is the only piece that carries strata**, at the holder's tier density — strata mean "record", so they appear only where a record exists. Stated as a rule.
  - Owner-supplied fields (`PH-ADDRESS`, `PH-CR`, `PH-PHONE`, `PH-CLIENT`) are dotted-underline blanks, listed on the spec page. Nothing about the company was invented.
- **`Kayan Social.dc.html`** — five assets painted on real canvases at true pixel size (avatar 1000², LinkedIn cover 1584×396, entry post 1080², number post 1080², story 1080×1920), each downloadable as PNG, plus a download-all. The canvas IS the preview, so what you see is exactly what exports.
  - The system's thesis: **three post types, no fourth** — an accepted entry, a published standard, a monthly number including the bad ones. Every post links its source. Posting law, caption voice, hashtag policy and the consent rule are stated on the page.
- Both mounted in the master as §١٤ `#stationery` and §١٥ `#social`, with manifest rows and cover chips.
- **Note on `doc-page` inside a DC:** the component detects explicit pagination via `:scope > .page` at connect, but a DC streams its children in *after* connect, so the sheet stays in flowing mode and pages render at the wrong width. The Stationery logic class polls `_measure()` until `.sheet.paginated` is set. Any future `doc-page` DC needs the same poke.

**Still open:** the ordered build queue now lives in the master itself — §الحوكمة → **«ما تبقى»** (`#remaining`).
It is the only approved priority list; the old NEXT/THEN/BEFORE-LAUNCH cards were removed as contradictory.

### Turn 3 — the bird, closed as far as design can close it
- **`#bird` postures rebuilt as a commissioning brief.** Each of the three slots now carries اللحظة / الإطار / الضوء / القص / اسم الملف, plus one shared delivery-terms card (3000px long edge, RAW+TIFF, AVIF+WebP art-directed, commercial worldwide perpetual licence, photographer credited in the asset register) and a «ما لا يجوز» card. §11 fix 6 is done: the gap now reads as a specification, not an omission. The `image-slot` ids are unchanged (`kayan-bird-perched` / `-sally` / `-return`) — dropping photos in still works.
- **The landing.** The one brand animation, built and demonstrable: the mark settles over 900ms on the settle curve with a blur-to-sharp mask, then absolute stillness; fires the `logo` cue only if sound is already armed; `prefers-reduced-motion` jumps to the end state. Handler `landMark` in the master's logic.
- **Species claims verified and cited.** Merops cyanophrys — IOC 2021 split, largely resident (corrected from «مقيم في اليمن طوال العام», which over-claimed); perch-and-sally hunting with return to the same perch (HBW / BOW); Golden-winged Grosbeak *Rhynchostruthus percivali* approved as Yemen's national bird by the Council of Ministers, BirdLife, 3 July 2008.
- **Stale schedule statuses fixed:** ٠٦ الحركة and ٠٩ المنتج were still «لم تبدأ» though both are built; ٠٥ الطائر is now «موقوف على التصوير»; ١١ الحوكمة is «قيد العمل».

**On the uploads:** the images in `uploads/` (IMG_0330–0336 etc.) are saved reference reels — a bird-in-hero website and an ECCO product page — not licensed bird photography. There is still no shootable asset in the project. Item A remains blocked on the owner; everything design can do about it is now done.

| | Artifact | File | In master | Notes |
|---|---|---|---|---|
| B | The record page `/v/<id>` | `Kayan Record.dc.html` | §١٣ `#record` | §14.10 item 1. Record + lookup + قرار مسبب refusals, strata draw-in, WhatsApp PNG share, embeddable tier badge, print stylesheet, offline bar. |
| — | The materials | `Kayan Materials.dc.html` | §١٢ `#materials` | §14.10 item 2 / §11 fix 1. Ratio law 60·25·10·5 with worked examples, palette with measured contrast, strata density spec incl. revocation strike, type scale, motion curves, accessibility contract. Downloads `kayan.tokens.json`, `kayan.tokens.css`, colour sheet PNG, tier badges SVG — all generated from the page. |

**Decisions taken while building, worth knowing:**
- Secondary text on the record page is `#33544D`, not `#4A6B64` — `#4A6B64` is only 5.4:1 on paper and §14.0 sets a 7:1 sunlight floor. `#33544D` measures 7.7:1. Treat `#33544D` as the body colour for anything read outdoors.
- The record page is **silent**. One sound in the whole site (`stamp`, consent-gated) lives on the lookup, not on the record.
- Numerals on the record page are **Western throughout** — it is a data document read in both languages.
- Latin runs embedded in Arabic sentences are wrapped in `\u2066…\u2069` (LRI/PDI). Without it, `MD-2025-204` reorders mid-sentence. Do this everywhere a code, date, or ID sits inside Arabic prose.
- House style drops **tanween** as well as تشكيل — «تلقائيا» not «تلقائياً», matching the master document.
- Entrance animations write themselves out of the DOM after they settle (a `settled` flag clears transform/transition), so the resting DOM is clean and any re-render shows the final state.
- The ledger — the actual accepted deliveries, with contract and محضر references — was added to the record page. §12 says the record is the product; a record page that shows only a count is a badge, not a record.

**Still open:** A (the five bird photographs, blocked on the owner), then §14.10 items 3–8.

---

## 1. The one file that matters

**`The master one.dc.html`** is the live master identity document. Everything else in the project
is either a superseded chapter or a source file. Work on this file unless told otherwise.

Earlier chapter files (`Kayan Bird - Chapter 02`, `Kayan Type and Mark - Chapter 03`,
`Kayan Motion and Components - Chapter 04`, `Kayan Sonic - Chapter 05`, `Kayan Master.dc.html`,
`Kayan Colour System.html`) are **reference only**. Their content has been folded into the master.
Do not edit them expecting the master to change.

### Section order as built
| # | id | Arabic label | What it holds |
|---|-----|---------------|----------------|
| — | — | الغلاف | Cover + chip nav |
| 00 | `#strategy` | الجوهر | Purpose, vision, mission, 5 values w/ audit tests, positioning statement, audience, "what we are not", 4 differences, persona sliders, always/never, 5-beat story, message house |
| — | — | القصة | Why these colours |
| 01 | `#palette` | اللوحة | Core palette |
| 02 | `#type` | الطباعة والعلامة | AR/EN type system, 7-step scale, two numeral systems, mark rules, 6 misuse cases |
| 03 | `#lines` | الخطوط | Line colours incl. future lines |
| 04 | `#card` | بطاقة كيان | 5 tier cards, flip front/back |
| 05 | `#sonic` (in card section) | الصوت | Sonic gate, 3 bird runes, 6 functional cues, WAV export |
| — | — | وقفات الطائر | 3 bird postures (image slots — **unfilled**) |
| — | `#sonicmap` | مصفوفة الصوت | Where each cue plays, 4 sound rules |
| 06 | `#motion` | الحركة والمكونات | 3 motion curves (clickable), buttons, escrow state machine, system states |
| 08 | `#voice` | الصياغة | Brand voice |
| 09 | `#competencies` | الكفاءات | 6 competencies w/ proof, 4 things we decline |
| 10 | `#presence` | الحضور | Contract cover, invoice, messaging, email signature, signage, social, co-branding |
| 11 | `#map` | الحوكمة | Schedule, governance, authority, precedence, colophon |

---

## 2. Standing rules (from CLAUDE.md — non-negotiable)

**Arabic is authored, never translated.** Administrative/contracting register — the language of
لوائح، عقود، محاضر استلام. Lead with the verb, usually passive. Compact sentences. No تشكيل.
No «تم + مصدر» — use the passive verb. No exclamation marks, no hype, no em-dash rhythm.
Real industry terms: حساب الضمان، محضر الاستلام، أمر تغيير، نطاق العمل، المستحق، جهة تزكية،
قرار مسبب، لجنة الالتزام. English is a **secondary** register — smaller, lighter, restates, never leads.

**Test before shipping any Arabic line:** could this sentence appear unedited in a real Yemeni or
Gulf contract, regulation, or bank notice? If no, rewrite.

**Never claim unverified facts** about Yemen, Aden, species, institutions, or dates.

**Tagline, verbatim:** «خلف كل نجاح، كيان» — _Behind every success, a Kayan._

---

## 3. Design decisions already made — do not re-litigate

**Visual language.** Rounded (`border-radius:18–22px` cards, `44px` section tops), max-width 1200px,
ink `#052E2B`, body text `#4A6B64`, muted `#6E675A`, paper `#FAF6EC`, rules `#EDE5D2`.
Sections alternate `#fff` / `#FAF6EC` / `#F1EAD9` / `#052E2B`. Calm, minimal, generous whitespace.

**Colour rule that caused a real bug — keep it.** Signature/line accent hexes (`#3E9EEA`, `#12B5A4`,
`#C9A227`, `#B8891A`) are **non-text cues only** — swatches, bars, dots. They fail contrast at 11–12px
on white. When an accent must identify a block, use a coloured bar + ink-coloured text, e.g.:
```html
<div style="display:flex;align-items:center;gap:8px;color:#4A6B64;">
  <span style="width:18px;height:3px;border-radius:2px;background:#3E9EEA;"></span>PILLAR 01
</div>
```

**Responsive rule.** Every section uses `padding: … clamp(20px,4vw,48px) …`. Every auto-fit grid
uses `minmax(240px,1fr)` or smaller. Larger minimums overflow at 380px. This was fixed at the cause
across the whole file — do not reintroduce `48px` literals or `minmax(280px+)`.

**Typography.** Alexandria (headings/names), IBM Plex Sans Arabic (body/UI),
Instrument Sans (Latin secondary, tabular numerals). Arabic line-height 1.9, Latin 1.6.
Never letter-space Arabic. Never italic Arabic. Never Arabic below 12px.
Numerals: Hindi (٠١٢٣) in narrative Arabic; Western (0123) for money, IDs, colour codes, anything
appearing in both languages.

**Cards.** Five tiers T0–T4: مسجل / معرف / موثق / مثبت / مؤتمن. 264×418px, flip on click.
The horizontal strata pattern on the face **densifies as the record grows** (gap 26→19→13→9→6px) —
the record made physical. Back carries verify URL, dot-matrix code block, an accepted-deliveries
bar, and the revocation clause. T4 alone gets the gold catchlight, the sheen animation, the tagline,
and the volunteer-hours marks.

**Sonic.** Every cue is built on **مقام رست on D**. The neutral third at **347 cents** — a quarter-tone
flatter than the Western major third — is the single interval that makes an ear hear "Arabic".
Nine cues: `logo, stamp, runeA, runeB, runeC, verify, tier, accept, halt`.
Three bird runes: A = الوروار (trill→settle, card read), B = الهدهد (هُدْ·هُدْ·هُدْ, notifications only),
C = الشرقب (rising fifth + shimmer, national moments only).
Rules: no sound before consent, no sound on load, sound confirms and never sells, silent by default
on mobile, one cue per event, −18 LUFS / −1 dBTP.
`renderWav()` renders offline at 48 kHz/16-bit, normalises to −1 dBFS, and downloads real files
named `kayan-sonic-<cue>.wav`. Both live playback and export share one `schedule()` — never fork them.

**Motion.** Three curves only: settle `cubic-bezier(.16,1,.3,1)` 400ms (entrances),
micro `cubic-bezier(.2,0,.2,1)` 140ms (touch), exit `cubic-bezier(.4,0,1,1)` 220ms (departures).
One thing moves at a time. Entrances slower than exits. Direction follows reading order.
`prefers-reduced-motion` always honoured.

---

## 4. Technical notes that will save you time

- The logic class holds: reveal-on-scroll IO with an 900ms failsafe, the audio engine
  (`ac / bus / deg / pluck / drone / schedule / fire`), offline WAV render + encode + save,
  and handlers `toggleArm, playCue, playSeq, exportAll, runCurve, advanceEscrow, flipCard, tiltMove, tiltLeave`.
- `data-cue` and `data-sound` are both read by `playCue` — legacy rows use `data-sound`.
- Any clickable sound row needs `position:relative` plus a `[data-progress]` child, or the
  progress bar positions against the wrong ancestor.
- **`run_script` has been timing out on this file** (it is large). Use `str_replace_edit` with a
  batched `edits` array, or `dc_html_str_replace` / `dc_js_str_replace`. Grep does not read across
  projects — copy a file in first.
- Inline styles only. No stylesheets, no classes. `<helmet>` holds only fonts, `@keyframes`, resets.

---

## 5. The one open item

**Five image slots are empty and need real licensed photographs** — this is blocked on the user,
not on design:
- `kayan-bird-perched` — واقف on an open branch, full body, calm side light. The mother image.
- `kayan-bird-sally` — منطلق, the launch, wing open, movement in air. Assignment only, never marketing.
- `kayan-bird-return` — عائد to the same branch, wing settling. Acceptance + payment. Rarest, heaviest.
- Two further slots in the bird chapter.

Direction: one bird, three postures, one light. The green reads in the light falling on it, not in
the feathers. Never illustrate the bird as an SVG — photography or nothing.

---

## 6. How the user works

Wants bold, elite, original work — Swiss-grade rigour, not template safety. Expects the designer
to **decide and lead**, explore ideas unprompted, and never just follow instructions. Values
brilliance in both Arabic and English equally. Dislikes filler, hype, and anything that reads as
generic. Asks for calm, minimal, bright, and genuinely animated.

When something is asked for in passing — "make the sounds available", "use the cards elsewhere" —
build it properly rather than gesturing at it.

---

## 7. Standing instruction to the next window

You are not a contractor taking tickets. **You are the person responsible for Kayan's identity.**
Act with the authority of a founding design partner: decide, justify in one line, build. Bring
proposals the owner did not ask for and could not have specified. If a section is weak, say so and
replace it. If an instruction would make the work worse, do the better thing and explain why in a
sentence.

**The standard.** Every screen should survive being put in front of a Gulf procurement officer, a
Yemeni contractor, and a design director at a Swiss studio — and satisfy all three for different
reasons. Rigour for the first, credibility for the second, restraint for the third.

**Three tests before anything ships:**
1. _The contract test._ Could this Arabic line appear unedited in a real contract or bank notice?
2. _The 380px test._ Does it hold at a narrow phone with no horizontal scroll?
3. _The deletion test._ If this element were removed, would anything be lost? If not, remove it.

**Never do:** decorative SVG illustration of the bird · gradient-soup backgrounds · emoji ·
placeholder lorem · a number without a source · a claim about Yemen or the species without a
cited check · English written first and translated · a new colour invented outside the palette.

---

## 8. Capabilities deliberately still unused — use them

Each of these is a real capability available in this environment that would visibly raise the work.
They are listed in the order I would build them.

**A. The verification page — `kayanwork.com/v/PH-ID`.**
Every one of the five cards points at this URL and it does not exist. It is the single highest-value
missing artifact in the whole system: the public surface where a client checks a person's record.
Build it as a DC. Bilingual, mobile-first, loads in one screen, no login. Shows: name, tier,
accepted-delivery count, the strata graphic from the card, revocation status, and the issuing clause.
This is the proof that makes «نثبت لا ندعي» true.

**B. The محضر الاستلام as a printable document.**
The most important document in the business, never designed. Use the doc_page starter
(`copy_starter_component` kind `doc_page.js`) so it is print-ready from the first line, then
`show_pdf_export_dialog`. One page. Fields: العقد، النطاق، المخرجات، معايير القبول، تاريخ التسليم،
قرار القبول، توقيع الطرفين. Design it like a bank form, not a certificate.

**C. The interactive product prototype.**
Read the "Interactive prototype" skill. Build the worker's path end to end as one DC with real state:
التسجيل ← التوثيق ← الفئة ← التكليف ← الضمان ← محضر الاستلام ← الصرف. Wire the existing sonic cues
to the real moments (`verify` on field complete, `tier` on promotion, `accept` on acceptance,
`halt` on rejection). This is where the sound system finally means something.

**D. Claude-powered scope writer.**
Read the "Claude API in prototypes" skill. Build a demo where a vague request in Arabic is turned
into a written نطاق العمل with مخرجات and معايير قبول. This is literally competency C01 made
interactive — the strongest possible proof of the positioning, and no competitor can show it.

**E. The card as a 3D object.**
Read the "3D object" skill (`three_d_stage.js`). Model the T4 card as a real object with edge, gold
tab, and embossed strata, downloadable as OBJ/GLB. Hand it to a card manufacturer. Almost no brand
system ships this; it is exactly the kind of touch that gets a system talked about.

**F. The brand film.**
Read the "Animated video" skill (`animations_v2.jsx`). 20 seconds: dark, one bird posture resolving,
the mark landing on the `logo` cue, tagline, cut. Silence for 14 seconds then one sound. Export the
WAV from the master doc and use it as the bed.

**G. The printed manual.**
The master doc is a screen document. A real firm hands partners a PDF. Build a `-print` copy on
`doc_page`, then `show_pdf_export_dialog`. Also produce a partner-facing deck via
`deck_stage.js` + "Export as PPTX (editable)".

**H. Offline single file.**
"Save as standalone HTML" → one self-contained file that opens with no network. This is how the
document survives Aden's connectivity, which is itself on-brand.

**I. Real geography.**
Read the "Maps & geography" skill. An accurate Aden map for the Hub — where the work is done and
where the value stays. Never a hand-drawn shape.

**J. Verify the species.**
`web_search` the bird claims and cite them in the document, per CLAUDE.md. Any species, endemism,
or heritage claim that cannot be sourced must be cut, not softened.

**K. Card production assets.**
`snapshot_element` at scale 4 on each tier card → PNGs for the printer, plus a spec line
(85.6×54mm, 4mm bleed, spot gold on T3/T4, matte laminate).

---

## 9. Ideas worth building that nobody asked for

- **The shareable record.** A worker's record as a WhatsApp-ready card image. This is the growth
  loop: every accepted delivery produces something the worker wants to send.
- **The promotion moment.** One screen, one animation, `tier` cue. Earning موثق should feel like
  something. Right now it is a database row.
- **The قرار مسبب letter.** A refusal with a stated reason and a route back. It is the hardest test
  of the voice and the truest expression of «الوضوح قبل اللطف». Design the template.
- **Founders' Wall.** Names of the first cohort, `runeC` on entry. The only place the gold is loud.
- **The onboarding kit.** What a new منفذ receives on day one: card, lanyard, one-page rules,
  a WhatsApp welcome that is three messages long.
- **The 30-second anthem.** Arrange the nine cues into one piece on Maqam Rast for events and film.
- **Bilingual email templates.** Assignment, acceptance, payment, refusal. Four templates, one voice.
- **A "what changed" page.** Version diffs of this document. Elite systems show their own history.

---

## 10. A–Z of what remains

| | Item | Blocked on |
|---|---|---|
| A | Five bird photographs into the image slots | **User** |
| B | Verification page `/v/PH-ID` | Ready to build |
| C | محضر الاستلام printable | Ready to build |
| D | Worker prototype, end to end | Ready to build |
| E | Claude-powered scope writer | Ready to build |
| F | Card as 3D object (OBJ/GLB) | Ready to build |
| G | Brand film, 20s | Needs E's WAV export |
| H | Printed manual PDF + partner PPTX | Ready to build |
| I | Standalone offline HTML | Ready to build |
| J | Aden map for the Hub | Ready to build |
| K | Species verification + citations | Ready to build |
| L | Card production assets for the printer | Ready to build |
| M | Shareable worker record | Ready to build |
| N | Promotion moment screen | Ready to build |
| O | قرار مسبب refusal template | Ready to build |
| P | Founders' Wall | Ready to build |
| Q | Onboarding kit | Ready to build |
| R | 30-second anthem | Ready to build |
| S | Four bilingual email templates | Ready to build |
| T | Version history page | Ready to build |

Nothing on this list except **A** requires the owner. Do not wait to be asked. Build in order,
show the work, and say what you decided and why.

---

## 11. Honest critique of the master document — fix these

I built it. These are its real faults, in the order they hurt.

**1. It is a document about a system, not the system itself.**
It describes rules it cannot enforce. Someone could read all of it and still build off-brand,
because nothing is machine-readable. _Fix:_ ship a downloadable token set (JSON + CSS custom
properties), a swatch file, and a logo pack, generated from the document itself. The manual should
hand you the materials, not just describe them.

**2. The cover is the weakest screen in the file.**
Dark green with radial gradients and a row of pill chips is the exact trope to avoid. It is
competent and anonymous. _Fix:_ the cover should be one idea, enormous. My proposal: the tagline set
at 12–15vw in Alexandria, a single hairline rule, the version stamp, and nothing else. Silence as a
design move — the same restraint the sound system preaches. The nav belongs in a slim sticky bar,
not as the cover's main event.

**3. No colour ratios are specified.**
Nine directions were explored and one survived, but the document never says how much of each colour
to use — so two designers will produce two different-looking systems from the same palette.
_Fix:_ state it as law: **60 paper · 25 ink · 10 structure · 5 accent**. Add a visible ratio bar and
three worked examples (a document, a screen, a dark surface).

**4. The strata idea is the best thing in the system and gets one caption line.**
Density of the engraved lines encoding accumulated record is genuinely original. It is buried.
_Fix:_ give it its own spread — a diagram of the five densities side by side with the gap values
(26→19→13→9→6px), the rule that density only ever increases, and what happens on revocation
(the pattern is struck through, not erased — a record is never rewritten).

**5. The value rows in §00 are five identical bars.**
Correct content, no rhythm, no hierarchy. A reader's eye slides off. _Fix:_ break the grid — one
value per screen-width band, alternating alignment, the audit test set as a quoted question in
larger type. Make the reader slow down.

**6. Three empty grey boxes sit in the middle of the document.**
The bird posture slots read as unfinished, not as awaiting art. _Fix:_ until photographs arrive,
fill them with a designed placeholder that states the brief, the licence requirement, and the
posture rule — so the gap looks like a specification, not an omission.

**7. The sound cannot be understood without clicking nine times.**
No notation, no waveform, no visual of the interval that the whole system rests on.
_Fix:_ draw the Rast tetrachord — show the 347-cent third against the Western 400-cent third as a
simple measured diagram. One picture explains the entire sonic thesis. Also verify the
`[data-bars]` visualiser target exists in this file; it was authored against an earlier document and
may be a dead reference.

**8. Accessibility is asserted, not specified.**
_Fix:_ state the contract — 4.5:1 for body, 3:1 for large text and UI edges, 48px touch targets,
visible focus rings on every interactive element, full keyboard reach, reduced-motion honoured,
and Arabic never below 12px. Then add the focus-visible styling, which the document currently lacks.

**9. There is no rule for when a surface is dark.**
Half the sections are dark green and the choice reads as rhythm, not logic.
_Fix:_ declare it — dark is for **moments of consequence** (acceptance, tier, signature, the Hub)
and for the bird. Light is for **working surfaces**. Never dark for decoration.

**10. Governance sits at the end and has no teeth.**
_Fix:_ put the version and date on the cover, add a changelog, and give every rule an owner.
A rule nobody owns is a suggestion.

**11. It cannot be printed.**
A brand manual that only exists on a screen is half a manual. _Fix:_ the print copy in §8-G.

**12. The nav does not track position.**
In a document this long the reader loses their place. _Fix:_ scroll-spy the chips, and add a thin
progress rule at the top.

---

## 12. What Kayan actually is — the strategic call

I am stating this as a decision, not an option. Everything above should be built on it.

### The insight
Yemen's constraint is not talent. It is **enforceable trust**. Every freelance platform in the world
solves _discovery_ — finding someone. None of them solve _guarantee_ in a low-trust, low-infrastructure
market. Kayan's real product is therefore not work and not people. It is **a liability position**:
the fact that a named institution is accountable for an outcome.

That has a consequence most brands in this space miss: **Kayan should not look creative. It should
look institutional** — closer to a clearing house, a registry, or a central bank notice than to an
agency. Warmth comes from precision, not from friendliness.

### The moat
The record. It is the only asset that compounds: every accepted delivery makes the next contract
easier to win and the worker harder to replace. Competitors can copy a palette in a week; they cannot
copy four years of محاضر استلام.

So: **the record is the product.** The card is the record made portable. The verification URL is the
record made public. The tier is the record made legible. Everything in the identity should orient
around that single object, and anything that does not serve it is decoration.

### The move that sets an era
Do not build a company. **Build a registry.**

The historic version of Kayan is the one where «مؤتمن في كيان» becomes a credential that _other_
employers, banks, and NGOs recognise and ask for by name — the way a professional body's membership
works. That reframes every decision:

- **Verification is public infrastructure, not a feature.** Free, permanent, no login, no rate limit.
  Anyone can check any record. Forever.
- **The record must outlive the company.** State it in the governance section: if Kayan ceases
  operations, the register is transferred to a named custodian institution and stays readable.
  Almost nobody writes this down. Writing it down is what makes people believe the rest.
- **Kayan should publish its own failure rate.** Disputes opened, disputes upheld, average days to
  payment. A registry that hides its numbers is a marketing company. This is the single most
  credibility-generating decision available, and it costs nothing but nerve.
- **The standard should be given away.** Publish the tier definitions and the محضر الاستلام template
  under an open licence so other Yemeni firms can adopt them. Whoever writes the standard owns the
  category; owning the category is worth more than owning the customers.

### What that makes the brand
Not "a platform for Yemeni talent." **The register of accountable work in Yemen.**
The tagline already carries it — «خلف كل نجاح، كيان» is a statement of liability, not of support.
Read it that way and the whole system snaps into focus.

---

## 13. The site — how it should work

Given §12, the homepage should not sell. **It should let you look something up.**

**The homepage is a lookup.** Dark, near-empty, one field:
**«تحقق من سجل»** — enter a Kayan ID, see the record. Below it, one line of what Kayan is, and the
live counters: عقود مسلمة · متوسط أيام الصرف · نزاعات مفتوحة. That is the entire first screen.

No hero image. No three-column value props. No testimonial carousel. A company whose thesis is
«نثبت لا ندعي» must open with proof, not with a pitch. This is also the strongest possible
differentiator: every competitor's homepage is a brochure; ours is an instrument.

**The rest of the site, in order of importance:**

1. **`/v/<id>` — the record.** The most-visited page and the most carefully designed one. Mobile
   first, loads on a weak connection, readable in one screen, shareable to WhatsApp as an image.
2. **`/للعملاء` — the client path.** Not features. One question — "what do you need delivered?" —
   and the four differences as the answer. Ends in a written نطاق, not a contact form.
3. **`/للمنفذين` — the worker path.** What you get: a record, a guaranteed wage, a route up. Show a
   real record, not an illustration. The honest version of the tier ladder, including how you fall.
4. **`/المعايير` — the standard.** Tier definitions, the محضر template, the dispute process — public
   and downloadable. This is the page that makes Kayan a registry rather than a vendor.
5. **`/الأرقام` — the numbers.** Updated monthly, including the bad ones.
6. **`/الهب` — the place.** Aden, on a real map, with hours and power/connectivity status.
7. **`/كيان-لليمن`** — the civic arm, stated plainly with hours delivered and no charity language.

**Behaviour.** Arabic default, English at `/en` and visibly secondary. Sub-second first paint on 3G;
assume the connection fails mid-session and design for it — the site should work read-only offline
once visited. One sound in the entire site (`stamp`, on the mark landing, once per session, after
consent). Motion only on the three curves. No cookie banner, because no tracking.

**The one thing to get right.** A worker in Aden opens the record page on a cheap Android phone with
two bars of signal, and it loads, and it looks like it was made for them. If that works, everything
else on this list is detail.

---

## 14. The website — every touch, in detail

This section is the build spec. It is long because the difference between a good site and a
world-class one lives entirely in decisions this size.

### 14.0 The governing constraint — design for Aden, not for a design award

Real conditions, and they are the brief:
- Power cuts of 6–12 hours are normal. The device is on battery, screen dimmed, often outdoors.
- Mobile data is metered and expensive. A 4 MB page is a real cost to a real person.
- Phones are mid-range Android, 2–4 GB RAM, often 3+ years old. Not iPhones.
- Sunlight is brutal. Low-contrast grey-on-grey is illegible at noon in Aden.
- Connections drop mid-session — not gracefully, but completely.

**Therefore, hard budgets (non-negotiable, treat as acceptance criteria):**

| Metric | Budget | Why |
|---|---|---|
| First paint | < 1.0s on 3G | Below this the page feels instant |
| Total page weight | ≤ 120 KB for `/v/<id>` | ~ half a second of metered data |
| Fonts | ≤ 2 files, subset, `font-display:swap` | Arabic webfonts are the #1 weight trap |
| JS on the record page | ≤ 15 KB, zero framework | It is a document, not an app |
| Lighthouse (mobile, throttled) | ≥ 95 across the board | Not a vanity number — a proxy for all of the above |
| Works with JS disabled | Record page: yes | Server-rendered HTML, JS is enhancement only |
| Works offline after one visit | Yes | Service worker, cache-first on the record |

**The heck that matters most:** the record page should be **statically generated per ID** and served
from the edge as pure HTML. No API call, no client render, no spinner. A record changes rarely;
regenerate on change. This is what makes it load in a second on two bars — and it is invisible,
which is the point.

**Contrast floor for sunlight:** body text minimum 7:1 against its background, not 4.5:1. Test
outdoors on an actual phone at 40% brightness. This alone will make the site feel different from
every competitor.

### 14.1 The palette, applied — not just declared

The document defines the colours. Here is how they behave on the site.

**Ratio law: 60 paper · 25 ink · 10 structure · 5 accent.** Enforced per screen, not per site.

| Role | Colour | Where it is allowed |
|---|---|---|
| Paper | `#FAF6EC` | Default background of every working surface |
| Ink | `#052E2B` | All body text, all headings |
| Body | `#4A6B64` | Secondary text only |
| Rule | `#EDE5D2` | Hairlines, table borders, dividers |
| Consequence | `#052E2B` (as background) | Acceptance, tier, signature, the Hub, the bird |
| Accent teal | `#12B5A4` | Non-text cues only — bars, dots, swatches |
| Gold | `#E9BE4B` | T4 and national moments only. Never a button. |
| Alarm | `#B23A31` | Dispute, revocation, refusal. Outline, never fill. |

**Rules that will keep it disciplined:**
1. **One accent per screen.** If a screen shows teal, it shows no gold. Two accents = neither reads.
2. **Gold is rationed to roughly 1% of pixels.** It marks the two rarest states. Spend it anywhere
   else and T4 stops meaning anything.
3. **Dark surfaces are for consequence, never rhythm.** Acceptance, promotion, signature, the Hub,
   the bird. If you cannot name the consequence, the surface is light.
4. **Never colour-code by line in body text.** The line colour appears as a 3px bar next to
   ink-coloured type — this is already the fix in §3 and it applies site-wide.
5. **The record page uses exactly one accent: the tier colour.** Nothing else on that page is
   coloured. The record is the subject; everything else recedes.

**The idea worth stealing from print:** give each line one **paper tint**, not one accent —
Managed Delivery on `#FAF6EC`, the Hub on `#F4F1E8`, Forge on `#F1EAD9`. A 2% shift in the
background is felt but not seen. Sections feel different without a single new colour appearing.

### 14.2 Type on screen — the details that separate real typography from CSS

- **Subset the Arabic fonts.** Full Alexandria + IBM Plex Sans Arabic is ~400 KB. Subset to the
  Arabic block + Latin basic + Arabic-Indic digits and it drops under 90 KB. This is the single
  biggest performance win available.
- **`font-display: swap`, and design the fallback.** Set the fallback stack's `size-adjust` so the
  system Arabic font occupies nearly the same space — no reflow jump when the webfont lands.
- **Optical alignment on Arabic/Latin pairs.** Latin caps sit visually high next to Arabic. Set the
  English line at 88% of the Arabic size and nudge it down 1px. Do this once as a component.
- **Numerals switch by context, automatically.** Hindi digits in narrative Arabic, Western for money,
  IDs, and codes. Build it as one utility so nobody has to remember.
- **Line length is capped at 62 characters in Arabic**, 68 in Latin. Arabic words are longer; the
  same character count reads longer.
- **`text-wrap: pretty` on paragraphs, `balance` on headings.** Free, and it removes orphans.
- **Never justify Arabic on the web.** Browser justification stretches the wrong things. Ragged end.

### 14.3 Motion — where it earns its place, and where it is forbidden

Three curves only (settle 400ms, micro 140ms, exit 220ms). Beyond that:

**Where motion is required:**
- **The mark landing on the homepage.** One time per session. The bird settles onto the wordmark —
  a 900ms settle, then absolute stillness. This is the only "brand" animation on the site.
- **The record loading.** The strata lines draw in, top to bottom, 400ms, staggered 20ms. It reads as
  the record being written. Then it never moves again.
- **Tier promotion.** The one genuinely emotional moment. Full-screen dark, the new tier name, the
  strata densifying from the old gap to the new, the `tier` cue. Two seconds. Then dismiss.
- **Escrow state change.** The bar moves and the chip slides 8px. Confirms that money moved.

**Where motion is forbidden:**
- Any scroll-triggered parallax. It is the clearest tell of a generic AI-generated page.
- Number counters ticking up. Show the number.
- Anything that moves while the user is reading.
- Loading spinners. If something takes long enough to need a spinner, the architecture is wrong.
- Hover effects that shift layout. Colour and shadow only.

**The detail almost nobody does:** make every animation **interruptible**. If the user scrolls or
taps mid-transition, the animation resolves to its end state immediately rather than finishing on
its own schedule. This is the difference between software that feels responsive and software that
feels like it is performing at you.

### 14.4 The pointer, the finger, the keyboard

- **Cursor is a statement.** Default arrow everywhere; `pointer` only on genuinely clickable things.
  Never `cursor: pointer` on a whole card unless the whole card navigates.
- **48px minimum touch targets**, and the target extends beyond the visual bounds via padding, not
  size. A 24px icon with 12px padding is a 48px target that looks like 24px.
- **Thumb zone.** On mobile, primary actions sit in the lower third of the screen. Arabic RTL means
  the natural thumb arc favours the **left** for right-handed users — mirror the usual assumption.
- **Focus rings are designed, not default.** 2px `#12B5A4` offset 2px, on every interactive element.
  Test the entire site with the keyboard only.
- **`:focus-visible`, not `:focus`** — no rings on mouse click, always on keyboard.
- **Hover is never the only affordance.** Half the audience has no pointer at all.
- **Text selection colour** set to a light teal wash. A one-line detail that signals care.
- **Tap highlight removed and replaced.** `-webkit-tap-highlight-color: transparent`, then a real
  140ms micro-response. The default grey flash looks unfinished on Android.
- **Scroll:** never hijack it. No smooth-scroll on anchors longer than 400ms. No scroll-jacking
  section snaps.
- **RTL is authored, not flipped.** Use `inset-inline-start`, `margin-inline`, and logical properties
  throughout so `/en` mirrors correctly with no separate stylesheet.

### 14.5 Page-by-page, with the decisions

**`/` — the lookup.**
Dark `#052E2B`, near-empty. One input, one line of copy, three counters. The mark lands once.
The input is autofocused on desktop, not on mobile (avoids the keyboard shoving the layout).
Invalid ID gives a `قرار مسبب`-style answer: what was wrong, and what to do. Below the fold:
one sentence on what Kayan is, and four links. That is the whole page. Under 60 KB.

**`/v/<id>` — the record.** _The most important page Kayan will ever ship._
Static HTML per ID. Above the fold on a 5" phone: name, tier, accepted count, status.
The strata graphic as an SVG, drawn once. Verify URL and issue date. Revocation status stated
plainly — `سارية` or `ملغاة` with the date and reason. A share button that generates a WhatsApp-ready
PNG **client-side** from a canvas (no server, no upload, works offline).
No navigation chrome except a small mark that links home. The record is the page.

**`/للعملاء` — the client path.**
Opens with the question, not the pitch: «ما الذي تحتاج تسليمه؟» Four differences as the answer,
each with its proof artifact linked (the escrow flow, the محضر template, a real record, the contract).
Ends in a scope conversation, not a contact form. If §8-D is built, this is where it lives.

**`/للمنفذين` — the worker path.**
Show a real record first, then the ladder. State the fall conditions as clearly as the rise
conditions — honesty here is the whole brand. Payment terms in the first screen: how much, when,
guaranteed by what. Not at the bottom.

**`/المعايير` — the standard.**
Tier definitions, the محضر template as a downloadable PDF, the dispute process, the open licence.
This page is what turns a vendor into a registry. It should look like a regulation, not a landing page.

**`/الأرقام` — the numbers.**
Contracts delivered, average days to payment, disputes opened, disputes upheld, tier distribution.
Updated monthly. Publishing the bad numbers is the point; a page that only shows good ones is
marketing and will be read as such.

**`/الهب` — the place.** Real Aden map. Hours. Current power and connectivity status if feasible —
which is both useful and the most on-brand detail on the entire site.

**`/كيان-لليمن`** — hours delivered, projects, named partners. No charity language, no photographs
of need. Stated like a ledger.

**`/en`** — full mirror, visibly secondary. Same URLs with the prefix. `hreflang` on every page.

### 14.6 Front-end architecture — what I would actually build

- **Astro or plain HTML + islands.** The record page ships zero JS. Interactive pieces (scope writer,
  share generator) are isolated islands. No SPA — an SPA is the wrong shape for a document site on
  a weak connection.
- **Static generation for every record.** Rebuild on change via webhook. Serve from edge cache.
- **Service worker, cache-first on records, network-first on numbers.** After one visit the record
  is readable offline — which for this audience is a feature, not a nicety.
- **No web fonts on the critical path.** System Arabic first, webfont swaps in.
- **Images: AVIF with WebP fallback, `loading="lazy"`, explicit dimensions.** The bird photographs
  are the only heavy assets on the site and must be art-directed per breakpoint, not scaled.
- **No analytics that tracks individuals.** Aggregate counts only, self-hosted. Then there is no
  cookie banner — which is itself a design win and a trust signal.
- **CSS: logical properties throughout, `@layer` for cascade order, custom properties from the token
  file.** The token file is generated from the brand document, so the site cannot drift from it.

### 14.7 Back-end — the parts that carry the promise

- **The register is append-only.** A record is never edited. A revocation is a new entry that
  supersedes, and both remain readable. This is the technical expression of «السجل قبل الادعاء».
- **Every acceptance is hash-chained** to the previous one, and the hash is printed on the محضر.
  Cheap to build, and it means the record can be proven unaltered without trusting Kayan.
- **Escrow is a state machine with named states in Arabic**, and every transition is logged with an
  actor and a timestamp. The UI states in the brand document are the real states, not a mock.
- **Export before lock-in.** Any worker can export their full record as a signed PDF at any time.
  Any client can export their contract history. A registry that traps your data is not a registry.
- **The custodian clause, implemented:** a nightly encrypted export to a named third institution.
  §12 promises the register outlives the company; this is the code that keeps the promise.

### 14.8 The details that make people talk about it

1. **The record page prints perfectly.** Someone will print it and hand it across a desk in Aden.
   Design the print stylesheet as carefully as the screen — it will be used.
2. **A WhatsApp-optimised share image**, 1080×1350, generated on device. This is the growth loop.
3. **Power-cut mode.** If the connection is lost, a small, calm bar in Arabic states what is cached
   and what is not. Never a browser error page.
4. **The 404 is a `قرار مسبب`** — states what was not found, why, and the route back. The refusal
   voice, applied where every other site defaults to a joke.
5. **One sound in the whole site.** `stamp`, once per session, after consent, on the mark landing.
   Restraint is more impressive than a sound system that fires constantly.
6. **`prefers-reduced-motion` and `prefers-contrast` both honoured**, and a visible manual toggle for
   the second — because a system setting is not always what a person needs at noon outdoors.
7. **View transitions between the lookup and the record** — native, 200ms, no library.
8. **The tier badge as an embeddable SVG.** A worker pastes it into a CV or a LinkedIn profile; it
   links back to the live record. This is how «مؤتمن في كيان» escapes the site and becomes a credential.
9. **Every page under 3 network requests to first paint.**
10. **A `/humans.txt`** naming everyone who built it. Small, generous, and entirely in character.

### 14.9 The roles this needs — honestly

Stated as capabilities, not headcount. One person can hold several.

| Role | What they own | Why it matters here |
|---|---|---|
| **Brand & identity director** | The system, the ratio law, saying no | Prevents drift; owns the register positioning |
| **Arabic type designer / editor** | Subsetting, optical pairing, the register of the copy | Bad Arabic typography kills credibility instantly with this audience |
| **Arabic copywriter (contracting register)** | Every line, authored not translated | The single hardest and most differentiating skill on the list |
| **Product designer (systems)** | Record, escrow, tier, dispute flows | These are the product; everything else is packaging |
| **Motion designer (restraint)** | Four animations, and the discipline to refuse more | Wrong hire adds parallax and destroys the positioning |
| **Front-end engineer (performance)** | The 120 KB budget, offline, RTL, a11y | The 3G Aden phone is the acceptance test |
| **Back-end engineer (integrity)** | Append-only register, hash chain, escrow states, custodian export | Turns brand promises into enforceable code |
| **Accessibility specialist** | 7:1 contrast, keyboard, screen readers in Arabic | Arabic screen-reader support is genuinely poor; test with real users |
| **Sound designer (Maqam-literate)** | Final production of the nine cues from the WAV exports | Must understand quarter-tones, not just DAWs |
| **Photographer (wildlife/documentary)** | The bird, three postures, one light | The only art the system needs and cannot fake |
| **Legal / compliance advisor (YE + GCC)** | Escrow, contracts, the custodian clause | The register claim must be legally real |
| **Ops lead in Aden** | Ground truth on power, banking, delivery | Will catch what any remote team gets wrong |

### 14.10 Build order

1. `/v/<id>` — the record page. Nothing matters until this is excellent.
2. The token file + component library generated from the brand document.
3. `/` — the lookup.
4. `/للمنفذين` and `/للعملاء`.
5. `/المعايير` — the page that makes it a registry.
6. `/الأرقام`, `/الهب`, `/كيان-لليمن`.
7. `/en` mirror.
8. Share image, embeddable badge, offline mode, print stylesheets.

---

## 15. Skills to activate in the first message of the new window

Paste this handoff, and name these skills in the same message:

**Always:**
- `Interactive prototype` — the record page, the lookup, and the worker flow are prototypes with real state
- `Frontend design` — aesthetic direction and the anti-generic discipline
- `emil-design-eng` — the polish, micro-interaction, and invisible-detail layer that §14.3–14.4 depends on
- `apple-design` — interruptible motion, gesture physics, and the restraint model

**Per artifact, when you reach it:**
- `Make a doc` + `Save as PDF` — the محضر الاستلام, the printed manual
- `Make a deck` + `Export as PPTX (editable)` — the partner deck
- `Animated video` — the 20-second brand film
- `3D object` — the T4 card as a manufacturable object
- `Claude API in prototypes` — the Arabic scope writer
- `Maps & geography` — the Aden map for the Hub
- `Save as standalone HTML` — the offline manual
- `Web research` — verifying the species claims, with citations
- `improve-animations` / `find-animation-opportunities` — the motion audit before launch
- `webapp-testing` — the 3G / 380px / keyboard-only acceptance pass
- `Handoff to Claude Code` — when the site moves from design into a real repo

**Opening line to use:**
> Read `Kayan Handoff.md`. Activate: Interactive prototype, Frontend design, emil-design-eng,
> apple-design. Start with §14.10 item 1 — the record page at `/v/<id>`. You have full authority;
> decide and build, and tell me what you decided.


