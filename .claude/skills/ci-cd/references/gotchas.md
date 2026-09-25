# CI/CD — Operational gotchas

Forward-applicable rules. Each one is marked **Applies now** (the condition exists in this
repository today) or **Caution for later** (a rule to apply when the corresponding piece is built).
Verify the current state in the code before trusting any specific detail.

---

## `pnpm migration:run|revert|show` already carries `-d` — do not add it again — **Applies now**

`package.json`'s `migration:run` / `migration:revert` / `migration:show` scripts are already
`pnpm typeorm <cmd> -d apps/api/src/data-source.ts`. Calling `pnpm migration:run -d
apps/api/src/data-source.ts` (mirroring the raw `pnpm typeorm migration:run -d …` form
`CLAUDE.md` §3 documents for the *`typeorm`* script) appends a second `-d
apps/api/src/data-source.ts`, and the CLI's own argument parser silently folds the duplicate flag's
values into an array. The failure surfaces two layers away from the real cause:
`TypeError: The "paths[1]" argument must be of type string. Received an instance of Array` inside
`typeorm`'s `MigrationRunCommand`, which reads as a Node internals bug rather than a duplicated CLI
flag.

- **Rule:** the wrapped scripts (`migration:run`, `migration:revert`, `migration:show`) take no `-d`
  — call them bare, or with their other own flags only. Only the raw `typeorm` script
  (`pnpm typeorm <cmd> -d apps/api/src/data-source.ts …`) needs `-d` supplied by the caller, exactly
  as `CLAUDE.md` §3 documents it.
- Verified empirically against the ephemeral acceptance database while wiring
  `apps/api-e2e:e2e-migrate`: `pnpm migration:run` (no extra flag) connects and reports "No
  migrations are pending"; `pnpm migration:run -d apps/api/src/data-source.ts` reproduces the crash
  above every time.

## `TS_NODE_PROJECT=X`, never `ts-node --project X` — **Applies now**

**This repository has no root `tsconfig.json`** — only `tsconfig.base.json`. That single fact breaks
the obvious form of the TypeORM CLI scripts.

With `ts-node --project X -r tsconfig-paths/register`, the `tsconfig-paths/register` hook is
registered **before** ts-node processes `--project`. The hook looks for `TS_NODE_PROJECT` or a
`tsconfig.json` in the working directory, finds neither, starts with no path mapping, and then fails
to resolve workspace aliases in entities loaded by glob — surfacing as `TS2307: Cannot find module`.

- **Rule:** any script combining `ts-node` with both `--project` and `-r tsconfig-paths/register`
  must use the environment-variable form: `TS_NODE_PROJECT=<tsconfig> ts-node -r tsconfig-paths/register …`.
- Applies to the `migration:generate` / `run` / `revert` / `show` scripts that `T-C10-16` delivers.
  `migration:create` needs no path resolution.
- `VAR=value command` works in bash and in Alpine containers but **not in Windows CMD**. Local
  development here happens on Windows: verify the scripts run in the shell contributors actually
  use, or use `cross-env`.

## A third-party image tag does not pin its own Node — **Applies now**

An image tag versioned by *the tool* is not versioned by *its Node*. A registry can rebuild that tag
on a newer base without changing the tag, and the workspace's `engines.node` (`>=22.0.0 <23.0.0`)
then rejects the install with `ERR_PNPM_UNSUPPORTED_ENGINE` — in the first job, before anything
useful runs.

- **Rule:** every third-party image used in a pipeline must pin Node **explicitly and verifiably**,
  ideally in the tag itself. Verify what a tag actually contains with
  `docker run --rm <image> node --version` — never from memory or documentation.
- Prefer `actions/setup-node` with `node-version-file: .nvmrc`, so the runner and the repository
  cannot drift apart. Reach for a prebuilt tool image only when you need the tool's system
  dependencies (browsers, for instance), and pin Node in it.

## pnpm 10 blocks postinstall, and Cypress downloads its binary there — **Applies now**

pnpm 10 does not run dependency build scripts by default. You can already see it on every install:
`Ignored build scripts: esbuild, lmdb, msgpackr-extract`. Cypress fetches its binary in a
`postinstall`, so without an explicit build-script allowlist it is never downloaded and
`cypress run` fails with `No version of Cypress is installed` — an error that says nothing about the
real cause.

- **Rule:** the allowlist is part of the harness, not an afterthought. And the binary lives in the
  user cache **outside the workspace**: cache that path explicitly in the pipeline or it
  re-downloads on every run.

## Cache and artifact paths must be relative to the workspace — **Applies now**

An absolute path outside the checkout is not archived. Runners tend to ignore it silently — zero
bytes stored, no failure — which reads exactly like a cache that is working.

- **Rule:** if something outside the workspace must persist between jobs, copy it in first
  (`cp -r <external> ./.cache-dir`) and cache the relative path, or accept the re-download and say
  so.

## `nx:run-commands` has no `finally` — **Applies now**

A `commands` array (`parallel:false`) stops at the first failure; it does not run whatever comes
after a red command. For an ephemeral resource brought up by an earlier task in the graph — the
`apps/api-e2e` acceptance database is the first case — that gap leaves the resource behind on every
red suite, which is exactly what `database.md`'s *"never point an acceptance run at a shared or
long-lived database"* rule exists to prevent.

- **Rule:** wrap the resource-owning command in a small Node script that runs the real command with
  `spawnSync`, tears the resource down inside a `finally`, and re-exits with the real command's own
  status code — see `tools/e2e/teardown-after.mjs`. A plain shell `; cleanup` (POSIX) has no single
  cross-platform equivalent Nx's default Windows shell (`cmd.exe`) shares, which is why this is a
  script and not a shell one-liner, the same reasoning behind the existing `tools/e2e/*.mjs` scripts.
- Bringing the resource **up** is a different problem and does not need this pattern: make it its own
  Nx target and put it in `dependsOn` of whatever needs it running first — Nx already runs a
  non-continuous dependency to completion before a continuous one that depends on it starts.

## `nx affected` needs history — **Applies now**

`nx affected` diffs against `defaultBase` (`main`). With `actions/checkout`'s default shallow clone
there is no base to diff against, so it either fails or quietly treats everything as affected — the
second is worse, because the pipeline looks fine while the whole point of `affected` is lost.

- **Rule:** `fetch-depth: 0` on any job that runs `affected`.

## Generators reintroduce version ranges — **Applies now**

Every Nx generator writes `^` or `~` ranges into `package.json`, and this workspace pins every
dependency exactly. It has happened on each scaffolding ticket so far.

- **Rule:** after any generator runs, convert what it added to exact versions and verify with
  `grep -nE '"[~^]' package.json` — the output must be empty. Do not trust a rewrite script's
  success message; check the file.

## `pnpm nx serve` leaves its child process alive — **Applies now**

Killing the Nx wrapper does not kill the Node process holding the port. It has bitten twice in this
repository.

- **Rule:** find the process actually listening (`netstat -ano`, or `Get-NetTCPConnection` on
  Windows), kill that PID, and confirm the port is free before declaring the job done. In a
  container, make the application PID 1 or use an init so signals reach it.

## PostgreSQL 18 images reject a volume mounted at `/var/lib/postgresql/data` — **Applies now**

From the `postgres:18` images on (docker-library/postgres#1259), the entrypoint keeps `PGDATA` in a
major-version subdirectory it manages itself (e.g. `/var/lib/postgresql/18/docker`), so it can tell
a stale data directory from another major apart from a fresh one. A volume mounted straight at
`/var/lib/postgresql/data` — the correct layout through PostgreSQL 17, and what every older example
shows — is seen as an *"unused mount/volume"* one level too deep: the container exits with code 1
and crash-loops as `unhealthy`. It bit `docker/docker-compose.dev.yml` in this repository, blocking
`T-C10-17` until it was fixed.

- **Rule:** mount the named volume at **`/var/lib/postgresql`**, never at `.../data`, for any
  `postgres:18.x` service. An ephemeral service with no volume is unaffected.
- **Symptom:** `docker ps` shows `Restarting (1)`, and `docker logs <container>` mentions
  `pg_ctlcluster`, major-version-specific directory names and an "unused mount/volume".
- A volume created with the old layout holds no usable data — remove it with
  `docker compose -f <file> down -v` for **that** Compose project only, then start again.

---

## Caution for later — Dockerfile copying libraries one by one

A Dockerfile that copies workspace libraries individually breaks **silently in the image** the first
time a library imports another one that is not in the `COPY` list. It works locally because the
whole workspace is present; it fails in the image with `TS2307: Cannot find module`.

- **Rule:** when a library gains an import on another library, add the corresponding `COPY`.
  Copying `libs/` wholesale is the more robust default, excluding what the target does not need
  (the backend image has no use for `libs/shared/ui`).
- Relevant here from `T-C10-07` onward, when `libs/` starts to exist.

## Caution for later — TypeORM CLI entity globs must match what the image ships

If an image ships TypeScript sources (because the build copies migrations as `.ts` assets and there
is no compiled data source in `dist/`), the CLI data source must declare its entity globs with
**`.ts`**, not `.js`. With `.js` patterns the CLI loads zero entities, fails quietly, and the
entrypoint exits non-zero with no useful message.

- **Rule:** when adding an entity or a library, verify both that the image copies its directory and
  that the glob matches the extension the image actually contains.
- Relevant here from `T-C10-16` / `T-C10-17` onward.

## Caution for later — Angular production builds and runner memory

Angular builds are memory-sensitive on Linux runners, and Nx can swallow the underlying error so the
job fails with no visible TypeScript error.

- This workspace uses **`@angular/build:application` (esbuild)**, which is far more memory-efficient
  than the old webpack builder where this problem was acute. Treat it as unlikely rather than
  expected.
- If it does appear: run `pnpm exec tsc --noEmit -p apps/web/tsconfig.app.json` before the build as
  a canary — it surfaces real type errors before Nx wraps them — and use `NX_VERBOSE_LOGGING=true`
  rather than `--verbose`, which produces unusable volume. Raise `--max-old-space-size` only after
  the canary is clean; an oversized heap can destabilise the host rather than fix the build.

---

## Not applicable here (recorded so nobody re-derives them)

- **`@nx/cypress` spec-pattern restrictions.** The plugin refuses spec patterns resolving outside a
  project root, which forces workarounds for shared `.feature` locations. **`@nx/cypress` is not
  installed** (ADR-011) and this repository keeps `.feature` files inside each e2e project
  (`apps/*-e2e/src/features/`), so neither the restriction nor the workaround applies.
- **GitLab CI specifics** (templates, `cache:paths` semantics, runner tags). The remote is GitHub;
  the platform is GitHub Actions.
