---
name: global-provider-testing-module-gotcha
description: A context module (e.g. IncidentModule) whose useFactory provider injects a @Global() token (EVENT_PUBLISHER) breaks any narrow Test.createTestingModule that imports only that context module.
metadata:
  type: project
---

When a bounded-context NestJS module (e.g. `IncidentModule`, `apps/api/src/app/incident/incident.module.ts`) binds a use case via `useFactory` with `inject: [...]` that includes a token provided by a `@Global()` module (e.g. `EVENT_PUBLISHER` from `EventDispatchModule`), any pre-existing spec that does `Test.createTestingModule({ imports: [IncidentModule] })` in isolation (not through `AppModule`) will fail `.compile()` — `@Global()` registration only takes effect when the global module is actually part of the same testing-module graph; it is not automatic just because `AppModule` imports it in production.

**Why:** discovered while wiring `T-C1-08` (`LogIncidentUseCase` bound with `inject: [INCIDENT_REPOSITORY, SLA_POLICY, EVENT_PUBLISHER, CLOCK]`). A pre-existing green spec (`log-incident.fixed-actor.spec.ts`, from `T-C10-74`) only imported `IncidentModule` and broke immediately once the factory needed `EVENT_PUBLISHER`. Nest eagerly instantiates every declared provider in a module at bootstrap, even ones nothing in that narrower graph consumes directly — there's no lazy skip.

**How to apply:** before adding a `useFactory` provider to a context module that depends on any `@Global()` token, grep that context's `apps/api/src/app/<context>/*.spec.ts` for `Test.createTestingModule({ imports: [<ContextModule>] ... })` and add the relevant global module (e.g. `EventDispatchModule`) to that same `imports` array — don't just fix production wiring and assume existing tests still pass; run them. This will recur for any future context module that adds its own use-case factory (`service-request`, `problem`, etc.).
