import {
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { LogIncidentRequesterRequest } from '@sport-itsm/shared-contracts';
import { IsNotBlank } from './is-not-blank.validator';

/**
 * `255` mirrors `Incident.log()`'s own `SHORT_DESCRIPTION_MAX_LENGTH`
 * (`incident.aggregate.ts`, itself `varchar(255)`, `DATA-MODEL.md` §20.3).
 * Duplicated as a literal rather than imported: `incident.aggregate.ts`
 * does not export that constant (only the error it produces), and this
 * ticket's own "do not touch `libs/incident/domain`" boundary means adding an
 * export there is not this ticket's call to make — reported as a finding.
 */
const SHORT_DESCRIPTION_MAX_LENGTH = 255;

/**
 * The `class-validator`-decorated class ADR-007 places in `apps/api`, never
 * in `libs/shared/contracts` (`T-C1-08` Trap 1 — see this ticket's report:
 * the ticket's own Scope text asked for the opposite, which the barrel
 * convention and ADR-007 forbid). Structurally `implements` the contract's
 * type so the two can never silently drift: adding a field here without
 * adding it to `LogIncidentRequesterRequest` (or the reverse) is a compiler
 * error.
 *
 * Every decorator here mirrors an invariant `Incident.log()` already
 * enforces, so the rejection happens at the HTTP boundary — before
 * `LogIncidentUseCase` ever allocates a reference — with the aggregate kept
 * as the final defense, not the only one (`T-C1-08` Trap 2):
 * - `shortDescription` — required, not blank, at most 255 characters
 *   (`IncidentShortDescriptionRequiredError` /
 *   `IncidentShortDescriptionTooLongError`).
 * - `description` — required, not blank (`IncidentDescriptionRequiredError`).
 * - `affectedServiceId` — optional; when present, must be a UUID
 *   (`InvalidIdentityError` is the domain's own, stricter v7-only check —
 *   this decorator only proves the edge-visible "is this even a UUID" shape,
 *   since `class-validator`'s `@IsUUID()` has no v7-specific mode).
 *
 * Declares **none** of `originChannel`, `reporterId`, Impact, Urgency,
 * Priority or the competition-in-progress flag (`US-C1-01`, `NFR-SEC-02`):
 * the global `ValidationPipe`'s `forbidNonWhitelisted` (`main.ts`) rejects
 * any of them outright if a client sends one, precisely because this class
 * never whitelists them (`T-C1-08` AC1/AC4).
 *
 * **One detail per constraint actually violated — never a cascade.**
 * `class-validator` normally evaluates every decorator on a property
 * independently, so a single bad value can report several details at once
 * even though only one of them is the *actual* problem (an absent
 * `shortDescription` used to fail `isString`, `isNotBlank` **and**
 * `maxLength` simultaneously — pure noise for the client `T-C1-10` will
 * render as one "what to do now" message per `{ field, rule }`, NFR-USE-05).
 * The global `ValidationPipe`'s `stopAtFirstError: true` (`main.ts`) makes
 * each property stop at its *first* failing decorator, so decorator order
 * on a property **is** the priority order of its rules — and TypeScript
 * runs multiple decorators on one member bottom-up (the one closest to the
 * property registers, and therefore fires, first). That is why the decorators
 * below read top-to-bottom as (`MaxLength`, `IsNotBlank`, `IsString`) —
 * the reverse of how the rules are described above — while firing in the
 * sensible order (type, then blank, then length):
 * 1. `@IsDefined()` always runs first regardless of position (`class-validator`
 *    special-cases `IS_DEFINED` outside the `stopAtFirstError` chain), so a
 *    missing/`null` value reports **exactly one** detail — `isDefined` — never
 *    reusing `isString`'s rule for what is really "field not sent".
 * 2. Otherwise the closest-to-the-property decorator (`IsString`) fires
 *    first: a wrong-typed value (e.g. a number) reports only `isString`,
 *    not also `isNotBlank`/`maxLength`, which would otherwise fail too
 *    since `isNonEmptyString`/`maxLength` treat "not a string" as invalid.
 * 3. Only once the value **is** a string do `IsNotBlank` and then
 *    `MaxLength` get a chance to fire — each still fully independent, so a
 *    valid-length blank string reports only `isNotBlank`, and a non-blank
 *    over-length string reports only `maxLength`.
 * Reordering these three decorators changes which rule wins for a
 * multi-violation value; do not "tidy" them back into declaration order
 * without re-verifying every case in `log-incident-requester.dto.spec.ts`.
 */
export class LogIncidentRequesterDto implements LogIncidentRequesterRequest {
  @IsDefined()
  @MaxLength(SHORT_DESCRIPTION_MAX_LENGTH)
  @IsNotBlank()
  @IsString()
  readonly shortDescription!: string;

  @IsDefined()
  @IsNotBlank()
  @IsString()
  readonly description!: string;

  @IsOptional()
  @IsUUID()
  readonly affectedServiceId?: string;
}
