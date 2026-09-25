/**
 * Entry point for the four `pnpm typeorm` commands of `CLAUDE.md` §3.
 *
 * The TypeORM CLI has to load `apps/api/src/data-source.ts`, which is
 * TypeScript and reaches a file whose decorators need `experimentalDecorators`.
 * `ts-node` therefore has to be told which tsconfig to compile against, and the
 * only portable way to do that is an environment variable — which cannot be set
 * inline in a package.json script on Windows. Hence this file rather than a
 * longer script string: the four commands stay readable and behave identically
 * on every platform.
 *
 * `.env` is loaded by the caller through Node's own `--env-file-if-exists`, so
 * the CLI sees exactly the environment the API validates at boot, and a
 * checkout without `.env` still reaches the validator's error message rather
 * than a missing-file crash.
 */
process.env.TS_NODE_PROJECT =
  process.env.TS_NODE_PROJECT ?? 'apps/api/tsconfig.app.json';

require('ts-node/register');
require('typeorm/cli.js');
