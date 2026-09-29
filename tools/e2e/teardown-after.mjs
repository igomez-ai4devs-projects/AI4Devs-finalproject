/**
 * Runs a test command, then always tears down an ephemeral Docker Compose
 * stack afterwards — on a green run and on a red one alike — and exits with
 * the test command's own status code.
 *
 * Why this exists rather than a plain shell `&&` chain: Nx's `run-commands`
 * executor has no "run this no matter what happened" step. A `commands` array
 * with `parallel:false` (the shape `apps/api-e2e`'s `e2e` target already used
 * for `assert-under-test` + `cypress run`) stops at the first failure, which
 * would leave the acceptance database container running on every red suite —
 * exactly the kind of leftover state `.claude/skills/ci-cd/references/database.md`
 * warns an ephemeral run must never produce. This script is the `finally` Nx
 * does not provide.
 *
 * It intentionally does not bring the stack up — that already has to happen
 * *before* `apps/api-e2e`'s continuous `serve-under-test` task starts (the
 * `e2e-db-up` target, a real Nx dependency, not something this script could
 * order correctly on its own). This script only owns the symmetric half: the
 * stack this run started must also come down, whatever the test outcome.
 *
 * Usage: node tools/e2e/teardown-after.mjs <compose-file> -- <test-command>
 * `<test-command>` is a single string, handed to the shell as-is (it may
 * itself chain with `&&`) — both cmd.exe (the shell Node spawns by default on
 * Windows) and a POSIX shell (Linux runners) understand plain `&&` chaining,
 * so no bash-only syntax is needed here.
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const separatorIndex = args.indexOf('--');

if (
  separatorIndex === -1 ||
  separatorIndex === 0 ||
  separatorIndex === args.length - 1
) {
  console.error(
    'teardown-after: usage: node teardown-after.mjs <compose-file> -- <test-command>',
  );
  process.exit(2);
}

const composeFile = args[0];
const testCommand = args.slice(separatorIndex + 1).join(' ');

/** Runs `docker compose -f <composeFile> <composeArgs...>`, streaming output. */
function dockerCompose(...composeArgs) {
  const result = spawnSync(
    'docker',
    ['compose', '-f', composeFile, ...composeArgs],
    { stdio: 'inherit' },
  );
  return result.status ?? 1;
}

let testExitCode;
try {
  const result = spawnSync(testCommand, { shell: true, stdio: 'inherit' });
  testExitCode = result.status ?? 1;
} finally {
  console.log(
    `teardown-after: tearing down the ephemeral stack (${composeFile}).`,
  );
  const downExitCode = dockerCompose('down', '-v');
  if (downExitCode !== 0) {
    console.error(
      `teardown-after: 'docker compose -f ${composeFile} down -v' failed ` +
        `(exit ${downExitCode}) — the stack may need manual cleanup.`,
    );
  }
}

process.exit(testExitCode);
