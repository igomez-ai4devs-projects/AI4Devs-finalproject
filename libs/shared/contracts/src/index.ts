/**
 * `@sport-itsm/shared-contracts` — the published language between the
 * Angular frontend and the NestJS backend (ADR-007, `ARCHITECTURE.md` §3.2,
 * §4.2, §5.4). This is the **only** permitted FE/BE coupling: both platforms
 * import this library; neither imports the other.
 *
 * **Convention (ADR-007).** Everything exported here is a plain type
 * declaration, an interface, or a frozen object literal used as a value —
 * never a class, never a decorator, never framework code. A backend
 * validation-decorated DTO that needs runtime checks is declared in
 * `apps/api`, as a class that structurally implements one of these types
 * (decorators applied field by field, per ADR-007's split). This library
 * imports no backend or frontend framework and no ORM — a probe that tries
 * proves the boundary rejects it (`T-C10-11` AC3).
 *
 * **Representation choice for the error-code enum.** `ErrorCode` is a frozen
 * object literal (`as const`) plus a derived union type, not a TypeScript
 * `enum` and not a `const enum`. `apps/web/tsconfig.json` sets
 * `"isolatedModules": true` (the Angular build compiles file-by-file), and a
 * `const enum` consumed by *value* across a module/library boundary under
 * `isolatedModules` cannot be inlined without whole-program information —
 * TypeScript itself rejects that import. A plain `enum` was rejected too:
 * this library's acceptance criteria (`T-C10-11`) permit "no runtime logic
 * beyond type declarations and `const` enums", and a regular `enum` compiles
 * to a runtime object with a reverse mapping, which is logic beyond a type
 * declaration. The `as const` object is a literal value, not logic, and both
 * `apps/web` and `apps/api` were proven able to consume it *by value*
 * (`pnpm nx build web` / `pnpm nx build api`, reverted after the proof).
 *
 * What is exported and where each shape comes from — see each file's own
 * doc comment for the full citation:
 * - `ErrorCode`, `ErrorEnvelope`, `ValidationErrorDetail` — `ARCHITECTURE.md`
 *   §3.2, row *Errors*, and this ticket's Scope (the four seeded codes).
 * - `PageRequest`, `PageResult` — **not normatively defined** where the
 *   ticket attributes them (§3.2 does not mention pagination); declared as
 *   the minimal conventional shape and reported as a finding.
 * - `CorrelationId`, `CORRELATION_ID_HEADER` — **not normatively defined**
 *   as a wire shape either; `DATA-MODEL.md`'s `correlation_id uuid` columns
 *   fix the value's shape, not the header name, which is this ticket's own
 *   minimal decision. Also reported as a finding.
 */
export { ErrorCode } from './lib/error-code';
export type {
  ErrorEnvelope,
  ValidationErrorDetail,
} from './lib/error-envelope';
export type { PageRequest, PageResult } from './lib/pagination';
export type { CorrelationId } from './lib/correlation-id';
export { CORRELATION_ID_HEADER } from './lib/correlation-id';
