---
name: feedback-infrastructure-libs-need-decorator-flags
description: type:infrastructure libs using TypeORM/@Injectable decorators need experimentalDecorators + emitDecoratorMetadata added explicitly to their own tsconfig.json — tsconfig.base.json doesn't set them.
metadata:
  type: feedback
---

`tsconfig.base.json` does not set `experimentalDecorators` or
`emitDecoratorMetadata`. `apps/api/tsconfig.app.json` sets both explicitly for
the same reason this note exists. Every `type:infrastructure` Nx library
scaffolded so far (`libs/incident/infrastructure`) only had
`tsconfig.json`/`tsconfig.lib.json`/`tsconfig.spec.json` extending
`tsconfig.base.json` with neither flag, so the first TypeORM entity
(`@Entity`, `@Column`, `@VersionColumn`, property decorators) and the first
constructor-injected concrete class (`@Injectable() class Foo { constructor(private readonly dataSource: DataSource) {} }`,
needed for Nest to resolve the param type without a bespoke token) both fail
to compile with `TS1240: Unable to resolve signature of property decorator
when called as an expression` until both flags are added to that library's own
`tsconfig.json`.

**Why:** this wasn't caught earlier because `T-C1-06` is the first ticket to
put TypeORM decorators or NestJS-DI-relevant constructor injection inside a
`type:infrastructure` library — every context library before it was either
empty or plain TypeScript with no decorators.

**How to apply:** when scaffolding or first populating any context's
`infrastructure` library with TypeORM entities or `@Injectable()` adapters,
add both flags to that library's `tsconfig.json` `compilerOptions` up front
(mirroring `apps/api/tsconfig.app.json`) instead of discovering the compile
error after writing the entity — every one of the six remaining `incident`
entities and every other context's infrastructure library will need this.
