import { InvalidIdentityError } from '@sport-itsm/shared-domain';
import {
  IncidentDescriptionRequiredError,
  IncidentOriginChannelRequiredError,
  IncidentReporterRequiredError,
  IncidentShortDescriptionRequiredError,
  IncidentShortDescriptionTooLongError,
  InvalidOriginChannelError,
} from '@sport-itsm/incident-domain';
import type { ValidationErrorDetail } from '@sport-itsm/shared-contracts';

/**
 * Maps `Incident.log()`'s own typed errors — the domain's **final** defense,
 * behind the DTO's edge-side checks (`T-C1-08` Trap 2) — to the one
 * `{ field, rule }` detail each of them represents.
 *
 * **Why an `instanceof` list, and why it is incident-specific.** `DomainError`
 * (`@sport-itsm/shared-domain`) carries a `message` and an `offendingValue`,
 * never a field name — there is no generic way to ask "which request
 * property caused you" without knowing the concrete subtype. This is exactly
 * the minimum `T-C10-40`'s real exception filter is expected to generalize
 * (a `DomainError` subtype declaring its own field, or a registry each
 * context contributes to); `GlobalExceptionFilter` only needs *this*
 * context's mapping today, so that is all this file declares. Reported as a
 * finding: a second context's ticket adding its own DomainError set will
 * either duplicate this pattern or force `T-C10-40` to arrive sooner.
 *
 * **Fields named for errors this route cannot actually reach today, kept
 * anyway.** `reporterId` and `originChannel` are never invalid coming out of
 * `IncidentController` — the server always resolves the actor and always
 * fixes `originChannel` to `'portal'` (`T-C1-08` Trap 2/6) — but
 * `Incident.log()` is a shared entry point (`T-C1-11`'s agent intake calls it
 * too) and this filter is global, not per-route. Mapping them now costs
 * nothing and avoids an unhandled `DomainError` falling through to `500` the
 * day another controller reaches this same aggregate differently.
 *
 * `rule` values reuse the same vocabulary the DTO's own `class-validator`
 * constraints produce (`isNotBlank`, `maxLength`, `isUuid`) where the
 * violation is the same kind, plus `isIn` for a closed-set membership check
 * with no DTO-side equivalent (`originChannel` is never client-supplied) —
 * one consistent rule vocabulary regardless of which layer actually rejected
 * the request.
 */
export function mapIncidentDomainErrorToDetail(
  error: unknown,
): ValidationErrorDetail | null {
  if (error instanceof IncidentShortDescriptionTooLongError) {
    return { field: 'shortDescription', rule: 'maxLength' };
  }
  if (error instanceof IncidentShortDescriptionRequiredError) {
    return { field: 'shortDescription', rule: 'isNotBlank' };
  }
  if (error instanceof IncidentDescriptionRequiredError) {
    return { field: 'description', rule: 'isNotBlank' };
  }
  if (error instanceof IncidentReporterRequiredError) {
    return { field: 'reporterId', rule: 'isNotBlank' };
  }
  if (error instanceof IncidentOriginChannelRequiredError) {
    return { field: 'originChannel', rule: 'isNotBlank' };
  }
  if (error instanceof InvalidOriginChannelError) {
    return { field: 'originChannel', rule: 'isIn' };
  }
  if (error instanceof InvalidIdentityError) {
    // The only user-suppliable `Identity` on this route is
    // `affectedServiceId` — `id`, `reporterId` and the acting identity all
    // come from server-controlled ports, never from request input
    // (`T-C1-08` Trap 2). A second route that feeds different user input
    // through `Identity.fromString` would need its own mapping, not this one.
    return { field: 'affectedServiceId', rule: 'isUuid' };
  }
  return null;
}
