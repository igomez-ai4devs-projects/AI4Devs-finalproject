---
name: feedback-cypress-local-verification
description: How to actually run `cypress run` / `nx e2e` locally in this sandbox (unset ELECTRON_RUN_AS_NODE in the same call) and what still needs a real GitHub Actions run to confirm
metadata:
  type: feedback
---

`cypress run` **can** be executed in this Windows sandbox, including through the full
`pnpm nx e2e <project>` chain — but only after `unset ELECTRON_RUN_AS_NODE` in the *same*
Bash tool call that runs it. This var is exported (`=1`) by default in every fresh shell this
sandbox hands out (an Electron-hosted editor's doing), and with it set, Cypress's own
`Cypress.exe` is launched in Electron's Node-mode, which rejects Cypress's own CLI flags with
`bad option: --smoke-test` / `bad option: --ping=<n>` and fails before opening the browser at
all. Confirmed by directly reproducing both states back to back on 2026-09-25 while wiring
`apps/api-e2e`'s ephemeral-database targets: same target, same code, `ELECTRON_RUN_AS_NODE=1`
→ red (`bad option`); `unset ELECTRON_RUN_AS_NODE` → green, real Cypress output, `1 passing`.

**Why it matters beyond the flag itself:** shell state does not persist between Bash tool
calls in this harness — each call starts a fresh profile that re-exports the var. `unset` in
one call has no effect on a later call; it must be `unset ELECTRON_RUN_AS_NODE && <command>`
in the one call that runs Cypress. An earlier version of this memory claimed `cypress run`
"cannot be executed... at all" based on a different symptom (`Illegal instruction`, exit 132)
seen invoking Cypress directly outside Nx — that may have been a distinct failure mode, or the
same root cause observed before this workaround was known; either way, treat "Cypress cannot
run here" as false until re-checked with the unset applied.

**How to apply:** when adding or changing a workflow step that runs `nx e2e <project>`, state
plainly what was verified (YAML validity, job graph and `needs`, `pnpm install
--frozen-lockfile`, the e2e projects' `project.json` shape) versus what only the first real
run on `ubuntu-latest` can confirm.

**But do not dismiss an `nx e2e` failure as environmental without checking.** A reproducible
"no run marker" failure from `tools/e2e/assert-under-test.mjs` was originally filed here as
Windows/Nx flakiness to be ignored. It was not: it was a real race, since fixed. Nx starts a
dependent task as soon as a continuous dependency is *registered* as running
(`tasks-schedule.js` checks `runningTasks.has(id)`) — `readyWhen` governs how that task
reports itself, not when its dependents begin — so a check that ran once could execute before
the supervisor had written its marker. It lost roughly one run in three. The fix was to make
the assertion wait for the marker, the process and the port rather than sample them once.
The lesson: a safety net that trips is evidence about the system until proven otherwise, and
"it only happens on Windows" is a hypothesis, not a diagnosis.
