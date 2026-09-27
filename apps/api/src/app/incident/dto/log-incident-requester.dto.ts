import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
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
 */
export class LogIncidentRequesterDto implements LogIncidentRequesterRequest {
  @IsString()
  @IsNotBlank()
  @MaxLength(SHORT_DESCRIPTION_MAX_LENGTH)
  readonly shortDescription!: string;

  @IsString()
  @IsNotBlank()
  readonly description!: string;

  @IsOptional()
  @IsUUID()
  readonly affectedServiceId?: string;
}
