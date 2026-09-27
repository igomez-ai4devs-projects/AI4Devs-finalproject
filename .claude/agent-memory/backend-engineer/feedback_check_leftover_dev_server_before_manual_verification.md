---
name: check-leftover-dev-server-before-manual-verification
description: Always verify PID/start time of whatever is bound to the dev API port before trusting curl output for manual verification
metadata:
  type: feedback
---

Before treating a manual `curl` against `http://localhost:3300` as proof a
code change works, check `netstat -ano | grep ":3300"` and the PID's actual
start time (`powershell -Command "Get-Process -Id <pid> | Select StartTime"`
or `wmic process where "ProcessId=<pid>" get CreationDate`). A stale `nx
serve api` process from a *previous, unrelated session* (observed: over a
day old) can still be bound to the port and answer requests with old
compiled code, making a real bug look fixed (or a fix look unfixed) purely
because you're talking to the wrong process.

**Why:** during the T-C1-08 follow-up (stopAtFirstError validation fix), the
first manual verification against port 3300 returned the pre-fix buggy
response even after the DTO/`main.ts` changes were made and unit/e2e tests
already passed — because a leftover `node.exe` from a session the day before
was still listening on 3300. Killing it and starting a fresh `nx serve api`
immediately showed the correct, fixed response. Trusting the first curl
result without checking would have produced a false "the fix doesn't work"
conclusion, or worse, gone unnoticed as a false confirmation in the other
direction.

**How to apply:** whenever the task involves starting a dev server for
manual verification (not just running the automated test suites), always
`netstat`-check the target port first, kill anything unexpected, then start
fresh and poll the server's own log for its "listening on" line before
curling. Don't rely on Bash's own `run_in_background` exit-status framing
either — appending a trailing `&` on top of `run_in_background: true`
produced a misleading "[exited with code 0]" notification while a real,
long-running `nx serve` was actually still active in the background under a
different PID; just pass the plain foreground-looking command with
`run_in_background: true` and no trailing `&`.
