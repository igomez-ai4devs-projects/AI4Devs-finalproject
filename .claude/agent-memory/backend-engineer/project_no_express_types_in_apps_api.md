---
name: no-express-types-in-apps-api
description: apps/api has no direct express/@types/express dependency (only transitive via @nestjs/platform-express); typing @Res()/exception-filter request-response objects needs a local structural interface, not `import type { Request, Response } from 'express'`.
metadata:
  type: project
---

`apps/api` does not declare `express` or `@types/express` in `package.json`, and pnpm's node_modules is strict — `express`/`@types/express` exist only nested under `node_modules/.pnpm/...` as transitive deps of `@nestjs/platform-express`, not hoisted to a location `apps/api`'s own TypeScript program can resolve. `import type { Request, Response } from 'express'` from `apps/api` source is therefore a real risk of an unresolvable-module compile error, and adding the dependency is out of bounds whenever a ticket says "no new dependencies."

**Why:** hit this while building `T-C1-08`'s `IncidentController` (needed `@Res({ passthrough: true })` to set a dynamic response header) and `GlobalExceptionFilter` (needed to read/write the raw HTTP request/response via `ArgumentsHost`).

**How to apply:** don't import express types. Declare a minimal local structural interface with only the methods actually used (e.g. `interface MinimalHttpResponse { status(code: number): MinimalHttpResponse; setHeader(name: string, value: string): MinimalHttpResponse; json(body: unknown): void; }` and `interface MinimalHttpRequest { readonly headers: Readonly<Record<string, string | string[] | undefined>>; }`), and type `@Res()` / `ArgumentsHost.switchToHttp().getResponse<T>()` / `.getRequest<T>()` against it. TypeScript's structural typing means the real Express object satisfies it at runtime with zero risk, and no module resolution is needed at compile time. Reuse this pattern (`[[project_global_provider_testing_module_gotcha]]` is the other `T-C1-08` gotcha) rather than reaching for `any` or a real express import.
