/**
 * Compiles `apps/api/src/data-source.ts` and its migrations to plain
 * CommonJS (`apps/api/tsconfig.migrations.json`), independently of the
 * webpack bundle `apps/api`'s `build` target produces, then patches the
 * webpack-generated `dist/apps/api/package.json` so the compiled artifact can
 * actually connect to PostgreSQL at runtime (T-C10-69).
 *
 * Why the patch is needed — a gap found empirically, not assumed: Nx's
 * `generatePackageJson` (wired through `apps/api/webpack.config.js`'s
 * `generatePackageJson: true`) infers the deployed image's runtime
 * dependencies from this project's *static* import graph. `typeorm` is
 * detected that way (`data-source.ts` imports it directly), but `pg` — the
 * actual Postgres driver `typeorm`'s `PostgresDriver` `require()`s lazily,
 * only once a connection is opened — is never a static import anywhere in
 * this codebase, so Nx never records that edge and omits `pg` even though it
 * is declared as an (optional) peerDependency of `typeorm` and is already
 * pinned in the root `package.json`'s own `dependencies`. Confirmed by
 * building `api` in production mode and inspecting the emitted
 * `dist/apps/api/package.json`: `typeorm` is present, `pg` is not.
 *
 * This script does not invent a version: it reads the exact `pg` pin from the
 * root `package.json` (the SSOT, `CLAUDE.md` §2) and copies it into the
 * generated manifest, so `pnpm install --prod` in `docker/backend/Dockerfile`
 * installs it and the compiled data source can open a real connection inside
 * the deployed image. If a future context wires `TypeOrmModule` into
 * `app.module.ts`, the same gap will resurface for the running API itself —
 * reported as a finding in the T-C10-69 report, not fixed here, since that is
 * a different artifact (`main.js`) than the one this ticket owns.
 *
 * Run as the `api:build-migrations` Nx target (`apps/api/project.json`),
 * which `dependsOn: ["build"]` so `dist/apps/api/package.json` already exists
 * by the time this script patches it.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const workspaceRoot = process.cwd();
// Invoked as `node <tsc.js>` rather than the `node_modules/.bin/tsc` shim:
// the shim is a `.CMD` wrapper on Windows, and `execFileSync` cannot launch a
// `.CMD` directly without a shell (`EINVAL`). Calling the real Node entry
// point through the current Node binary works identically on every platform.
const tscEntryPoint = join(
  workspaceRoot,
  'node_modules',
  'typescript',
  'lib',
  'tsc.js',
);

execFileSync(
  process.execPath,
  [tscEntryPoint, '-p', 'apps/api/tsconfig.migrations.json'],
  { stdio: 'inherit', cwd: workspaceRoot },
);

const rootPackageJsonPath = join(workspaceRoot, 'package.json');
const distPackageJsonPath = join(
  workspaceRoot,
  'dist',
  'apps',
  'api',
  'package.json',
);

const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf-8'));
const distPackageJson = JSON.parse(readFileSync(distPackageJsonPath, 'utf-8'));

const pgVersion = rootPackageJson.dependencies?.pg;
if (!pgVersion) {
  console.error(
    'build-api-runtime: root package.json no longer declares a "pg" ' +
      'dependency. apps/api/src/data-source.ts needs it at runtime to open a ' +
      'PostgreSQL connection — update this script if the driver dependency ' +
      'moved or was renamed.',
  );
  process.exit(1);
}

distPackageJson.dependencies ??= {};
distPackageJson.dependencies.pg = pgVersion;

writeFileSync(
  distPackageJsonPath,
  `${JSON.stringify(distPackageJson, null, 2)}\n`,
);

console.log(
  `build-api-runtime: compiled data-source.js + migrations, and ensured ` +
    `dist/apps/api/package.json declares "pg": "${pgVersion}".`,
);
