# The one prompt for Claude Code

Open a terminal in the folder that contains this package, start Claude Code, and paste exactly this:

---

Read `design_handoff_kayan_website/BUILD/00-START-HERE.md` and execute the entire handover, start to finish, at your own pace, without waiting for approvals between sessions.

You have full rights to create, build, commit, push, test, and decide within the handover's laws. Specifically:

1. **Repository.** Work in git from the first minute. Remote: `https://github.com/matrix712/kayan--Maher--full-` (branch `main` — it currently holds only a README stub; preserve its history, never force-push). Organize it exactly as `00-START-HERE.md §Repository` maps it: production code at the root, the design bundle preserved verbatim under `design-reference/`, the eleven BUILD docs renamed into `docs/`, `CLAUDE.md` (from `BUILD/CLAUDE.md.template`) and `PROGRESS.md` at the root, CI workflow in `.github/workflows/verify.yml`. Session 0's FIRST commit is this organization — docs and designs land on `main` before any product code.
2. **Sessions.** Follow `docs/01-SESSIONS.md` in strict order. A session is closed only when its gates are green (`pnpm verify`), `PROGRESS.md` and the repo `README.md` are updated, and the commits plus the `session-NN` tag are pushed.
3. **README as the living dashboard.** After every session, update the repo `README.md`: status table (session, date, what shipped), how to run, what remains. A stranger reading the README must always know exactly where the build stands.
4. **Truth.** The design files in `design-reference/` are the pixel- and copy-level source of truth; the BUILD docs are the engineering contract; `docs/07-SECURITY.md` wins every conflict. Arabic is the authored source language — never retype, never "fix" copy.
5. **Owner inputs.** Only two exist: SMTP credentials (Session 10) and DNS access (Session 12). If missing, continue with staging placeholders and record them in `PROGRESS.md` under "awaiting owner".

Begin with Session 0 now.

---

That is the whole ceremony. Everything else — stack, schema, API, admin console, security, EasyPanel deployment, QA gates, launch checklist — is already written in `BUILD/`.
