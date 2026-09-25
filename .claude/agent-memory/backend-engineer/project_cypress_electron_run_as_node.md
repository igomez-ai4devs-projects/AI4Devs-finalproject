---
name: project-cypress-electron-run-as-node
description: Cypress failing with "bad option --smoke-test" on this machine is ELECTRON_RUN_AS_NODE=1 inherited from the VS Code shell, not a broken binary — unset it in the same Bash call.
metadata:
  type: project
---

When `cypress run` / `npx cypress verify` fails on this Windows machine with
`Cypress.exe: bad option: --smoke-test` (or `--ping=...`), the binary is fine: the shell that
Claude Code runs in (inside VS Code, an Electron app) exports `ELECTRON_RUN_AS_NODE=1`, which makes
Cypress's own Electron binary behave as plain Node and reject its flags. Reinstalling Cypress does
not help.

**Why:** misdiagnosed as a broken binary while verifying T-C10-17 (2026-09-25); `unset
ELECTRON_RUN_AS_NODE; pnpm nx e2e api-e2e` then ran fully green (1 passing, stack torn down).

**How to apply:** prefix any Cypress-driving command with `unset ELECTRON_RUN_AS_NODE;` in the
**same** Bash call (shell state does not persist between calls). Not a repo defect; CI is unaffected.
