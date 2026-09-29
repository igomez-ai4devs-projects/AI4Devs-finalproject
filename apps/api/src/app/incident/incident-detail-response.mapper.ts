import type { IncidentDetailResponse } from '@sport-itsm/shared-contracts';
import type { IncidentSnapshot } from '@sport-itsm/incident-domain';

/**
 * `IncidentSnapshot` -> `IncidentDetailResponse` (`T-C1-100`) — the one place
 * this route decides what the requester sees versus what stays an internal
 * storage detail. See `incident-detail.contract.ts`'s own doc comment for the
 * field-by-field justification; this function only carries out that decision.
 *
 * A standalone, framework-free function rather than inline object literal in
 * the controller (unlike the `POST` route's one-liner): the mapping here
 * touches every field on the snapshot, once each, and is worth unit-testing
 * on its own — decoupled from `@Res()`/correlation-id concerns the controller
 * still owns.
 */
export function toIncidentDetailResponse(
  snapshot: IncidentSnapshot,
): IncidentDetailResponse {
  return {
    reference: snapshot.reference.value,
    loggedAt: new Date(snapshot.loggedAtEpochMs).toISOString(),
    originChannel: snapshot.originChannel.code,
    shortDescription: snapshot.shortDescription,
    description: snapshot.description,
    affectedServiceId: snapshot.affectedServiceId?.value ?? null,
    categoryId: snapshot.categoryId?.value ?? null,
    impact: snapshot.impact?.value ?? null,
    urgency: snapshot.urgency?.value ?? null,
    priority: snapshot.priority?.code ?? null,
    competitionAffectsInProgress: snapshot.competitionAffectsInProgress,
  };
}
