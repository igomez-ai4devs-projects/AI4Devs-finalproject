---
name: class-validator-stop-at-first-error-ordering
description: How to get exactly one ValidationErrorDetail per property with class-validator's stopAtFirstError, and why decorator declaration order matters
metadata:
  type: project
---

The app-wide `ValidationPipe` (`apps/api/src/main.ts`) now sets
`stopAtFirstError: true` (added in the T-C1-08 follow-up that fixed
`POST /api/incidents` reporting 3 details for one missing field). This is a
**global** policy: every DTO's properties now report at most one violated
rule each, in decorator-declaration order — never a cascade of every
decorator that happened to fail on the same bad value.

**Why:** `T-C1-10` renders each `{ field, rule }` detail from
`ValidationErrorDetail[]` (contract in `libs/shared/contracts`) as one "what
to do now" message (NFR-USE-05). A missing field used to fail `isString`,
`isNotBlank` **and** `maxLength` at once — pure noise, since the client only
needs to know "this is required."

**The non-obvious mechanics** (verified empirically against installed
`class-validator@0.14.2`, not just read from docs — see
`log-incident-requester.dto.ts`'s own doc comment for the full write-up):
- `@IsDefined()` on a property always runs **first**, regardless of where it
  is written in the decorator stack — `class-validator` special-cases
  `IS_DEFINED` outside the `stopAtFirstError` chain. So `@IsDefined()` is the
  reliable way to get a single, dedicated "required" rule name for an
  absent/`null` value, distinct from whatever the next decorator would have
  reported (e.g. `isString`).
- For the *other* decorators on the same property, `stopAtFirstError` stops
  at the first one that fails — and TypeScript applies multiple decorators
  on one class member **bottom-up**: the decorator closest to the property
  registers (and therefore evaluates) **first**. So to make `IsString` win
  over `IsNotBlank`/`MaxLength` for a wrong-typed value, `IsString` must be
  the *last* decorator written (closest to the property), with the others
  stacked *above* it in reverse priority order.
- `@ValidateIf()`/`@IsOptional()` on a property gate **everything** for that
  property, including `@IsDefined()` — the `!canValidate` early return in
  `ValidationExecutor.performValidations` happens *before* the `IS_DEFINED`
  check runs. Never combine `@IsDefined()` with a `@ValidateIf()` condition
  that could be false on a missing/`null` value: it silently makes the field
  effectively optional, which is highly likely to be an actual bug, not a
  design choice.

**How to apply:** when adding a new required string field with format
constraints (blank/length/pattern checks) to any DTO in `apps/api`, expect
`stopAtFirstError: true` already applies globally. Put `@IsDefined()` first
in the file (position doesn't matter for its own priority) for a dedicated
"required" rule, then order the remaining decorators **bottom-up in priority
order you want them to fire** (most fundamental/type-level check closest to
the property). Write a comment explaining the reversed order — it reads
backwards from intuitive top-to-bottom priority and will look like a mistake
to a future reader who doesn't know this mechanic. Verify any reordering
empirically (a quick throwaway jest spec calling `validate(dto, {
stopAtFirstError: true })` and logging `error.constraints`) rather than
reasoning from the decorator list alone — it's easy to get backwards.

See also [[project_typeorm_cli_no_tsconfig_paths]] for another
class-validator/TypeORM-adjacent CLI gotcha in this repo.
