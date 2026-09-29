import {
  DomainError,
  describeValue,
  Identity,
} from '@sport-itsm/shared-domain';

/**
 * The minimal view of "whoever is calling" that `LogIncidentUseCase` needs,
 * stated in `incident`'s own vocabulary — **not** the `identity-access`
 * `Actor` that `T-C10-38` designs (roles, resolved permission set,
 * competition/league scope grants). This ticket cannot depend on that type:
 * `T-C10-38` places it in `libs/identity-access/domain`, which does not
 * exist, and even if it did, the scope rule (`ARCHITECTURE.md` §5.3) forbids
 * `scope:incident` from depending on `scope:identity-access`.
 *
 * **Reported as a finding for the architect, not fixed here.** The
 * `identity-access` `Actor` cannot cross the scope boundary into any
 * consuming context as-is. Either it moves to the shared kernel (if its
 * shape turns out to be truly context-free — doubtful, since permissions are
 * `identity-access` vocabulary), or every consuming context declares its own
 * anticorruption view of it, the same pattern `CompetitionSubjectLookupPort`
 * already uses for the SCMS boundary (`ARCHITECTURE.md` §5.4), and
 * `apps/api` adapts the real `Actor` (`T-C10-39`) into each context's view
 * at the composition root. This type is `incident`'s attempt at that view,
 * offered as one data point for that decision — not a precedent this ticket
 * has authority to set on its own.
 *
 * Only what `LogIncidentUseCase` actually needs: an identity to become the
 * reporter (and `loggedBy`, `T-C1-05` Trap 5), and the capability to decide,
 * deny-by-default, whether this identity may log an Incident naming itself
 * as reporter. No permission catalog is invented — `US-C1-01`'s slice needs
 * exactly one yes/no decision, not a general predicate engine (YAGNI); a
 * later ticket that needs a second privileged operation on `incident` is
 * free to extend this interface, or to replace it outright once the
 * cross-context question above is resolved.
 */
export interface IncidentActor {
  /** Becomes both `Incident.reporterId` and `Incident.loggedBy` (AC2 — never the command's own value). */
  readonly identity: Identity;

  /**
   * Deny-by-default (`T-C10-38`'s spirit): `true` only when this actor is
   * entitled to log an Incident naming itself as the reporter. There is no
   * wildcard and no implicit allow — an actor with no stated capability
   * denies, it does not default to permitted.
   */
  canLogIncidentAsRequester(): boolean;
}

/**
 * Raised when {@link IncidentActor.canLogIncidentAsRequester} denies. Names
 * the attempted operation, mirroring `T-C10-38`'s `AuthorizationError`
 * (operation + reason) without importing that ticket's type — it does not
 * exist in a library `incident` may depend on (see the finding above).
 */
export class IncidentLogAuthorizationError extends DomainError {
  constructor(
    readonly operation: string,
    offendingValue: unknown,
  ) {
    super(
      `Actor is not authorized to perform "${operation}"; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}
