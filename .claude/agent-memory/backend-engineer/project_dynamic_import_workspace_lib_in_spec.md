---
name: project-dynamic-import-workspace-lib-in-spec
description: A spec file that dynamically import()/require()s any @sport-itsm/* workspace library trips @nx/enforce-module-boundaries repo-wide; also watch for stale Nx daemon graph cache producing phantom lint errors.
metadata:
  type: project
---

`jest.isolateModulesAsync`/`isolateModules` sandbox the *entire* Jest module registry per call — a class or `Symbol()` token from a workspace library (e.g. `@sport-itsm/incident-domain`'s `INCIDENT_REPOSITORY`) imported inside the sandbox is a **different identity** than the same specifier imported outside it (or in another sandbox call). This is real and reproducible: a test that needs `context.get(SOME_TOKEN)` after booting `AppModule` fresh under a different env (the `jest.isolateModulesAsync` pattern `apps/api/src/testing/test-event-dispatch.harness-gating.spec.ts` established) must obtain that exact token/class from *inside* the same sandbox callback that built the container — not from a top-level static import.

**But dynamically importing (`import()` or `require()`) any `@sport-itsm/*` workspace library from a spec file — for this identity-matching reason or any other — trips `@nx/enforce-module-boundaries`'s lazy-loaded-library check.** The rule then flags *every ordinary static import* of that library anywhere in the whole repo as an error ("Static imports of lazy-loaded libraries are forbidden"), 20+ unrelated files, because it treats the library as "lazy-loaded" project-wide the moment one file dynamically imports it. `checkDynamicDependenciesExceptions` is deliberately `[]` in `eslint.config.mjs` and must not be touched (`CLAUDE.md` §3: "no exception list … the fix is always the design").

**Why:** Discovered implementing `T-C10-78` (`PersistenceModule.forMode()`), writing a boot-time spec that needed `INCIDENT_REPOSITORY`/`InMemoryIncidentRepository`/`LogIncidentUseCase` by identity from a freshly-`isolateModulesAsync`-booted `AppModule`. Confirmed empirically: switching the dynamic import from `import()` to `require()` did **not** help (both trip the rule); external npm packages (`typeorm`, `@nestjs/core`) and same-project relative files (`./app.module`, `../persistence/persistence.module`) are **not** flagged — only cross-project `@sport-itsm/*` specifiers are.

**How to apply:** When a test needs container-resolved, identity-sensitive workspace-lib values (repository/use-case instances, port symbols) from an env-driven, freshly-reimported `AppModule`, split the proof into two files/styles instead:
1. An `isolateModulesAsync`-based boot spec that touches **only** external packages and same-project files (e.g. proving `DataSource` presence/absence via `typeorm`'s own class, captured inside the sandbox).
2. A plain, top-level-static-import spec (`Test.createTestingModule` composing the dynamic module directly with an explicit enum value, e.g. `PersistenceModule.forMode(PersistenceMode.Memory)`) for anything that needs a workspace-lib class/token by identity — no environment variable or module-registry isolation needed if the thing under test takes its mode as a plain parameter rather than reading `process.env` itself.

**Also:** after any file add/remove that changes lint behavior in confusing ways, run `pnpm nx reset` before trusting a lint failure — the Nx daemon's cached project graph can produce phantom "lazy-loaded library" errors that vanish after a reset, wasting real debugging time on a stale-cache artifact rather than an actual boundary violation. Confirm the failure survives a reset before concluding it's real.
