---
name: project-typeorm-cli-no-tsconfig-paths
description: Every *.entity.ts loaded by the TypeORM CLI glob must avoid @sport-itsm/* alias imports — tools/typeorm.cjs has no tsconfig-paths hook.
metadata:
  type: project
---

`apps/api/src/data-source.ts` registers entities via a glob
(`libs/<context>/infrastructure/src/**/*.entity.{ts,js}`) that the TypeORM CLI
(`pnpm typeorm migration:*`, run through `tools/typeorm.cjs`) resolves and
`require()`s directly through `ts-node/register`. That script sets only
`TS_NODE_PROJECT` — it never loads `tsconfig-paths/register` — so plain Node
`require` resolution applies: relative imports and real `node_modules`
packages resolve fine, but `@sport-itsm/*` path aliases (virtual, wired only
through `tsconfig.json` `paths` + webpack/Jest module resolution) throw
`Cannot find module '@sport-itsm/...'` the instant an `*.entity.ts` file
imports one — confirmed empirically on `T-C1-06` (`IncidentEntity` importing
`ORIGIN_CHANNEL_CODES` from `@sport-itsm/incident-domain` broke
`migration:show`/`migration:run` outright, even though migrations never touch
entity metadata for anything beyond loading the class).

**Why:** `tsconfig-paths` is listed in the `sport-itsm-backend` skill's stack
table ("ts-node + tsconfig-paths — used for TypeORM CLI execution") but is
**not actually an installed dependency** (`package.json` has no
`tsconfig-paths` entry as of `T-C1-06`), and adding it is a new dependency a
ticket may not introduce without an approved change. Until someone adds it and
wires `tools/typeorm.cjs` to load it, every `*.entity.ts` file must stay a
**leaf**: only `typeorm` imports and relative imports to sibling files inside
the same infrastructure library, never a cross-library alias. If a value
needs to be shared with the domain layer (e.g. a closed enum's code list),
duplicate it locally in the entity file with a comment pointing at the domain
source of truth — the same constraint that already forces migration files to
restate enum values as raw SQL literals rather than import them.

**How to apply:** before adding any new `*.entity.ts` (the six remaining
`incident` entities, and every other context's first entity), check its
import list contains no `@sport-itsm/*` specifier, and actually run
`pnpm typeorm migration:show -d apps/api/src/data-source.ts` against a real
Postgres to prove the CLI still loads — do not trust that Jest/webpack
resolving the same import proves the CLI path works, since Jest and webpack
both resolve the alias while the raw CLI does not. See also
[[feedback-typeorm-cli-env-shadowing]] for the other CLI-invocation gotcha on
this machine.
