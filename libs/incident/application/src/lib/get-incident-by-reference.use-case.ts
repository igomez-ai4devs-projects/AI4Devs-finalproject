import { TicketReference } from '@sport-itsm/shared-domain';
import { err, ok, Result } from '@sport-itsm/shared-util';
import {
  IncidentReadRepositoryPort,
  IncidentSnapshot,
} from '@sport-itsm/incident-domain';

/**
 * The typed failure `GetIncidentByReferenceUseCase` returns when no Incident
 * matches — `T-C1-99` AC2: "never a generic error and never a thrown
 * exception the caller must guess at". A plain, JSON-serializable record
 * rather than a `DomainError` subclass: nothing here is exceptional (a
 * requester quoting a stale or mistyped reference is an expected, everyday
 * outcome of a lookup), so there is no error to *throw* in the first place —
 * only a negative result to *return*. `reference` is carried through so the
 * caller (`T-C1-100`'s controller) can echo it back without having kept its
 * own copy.
 */
export interface IncidentNotFoundOutcome {
  readonly reason: 'INCIDENT_NOT_FOUND';
  readonly reference: TicketReference;
}

/**
 * `GetIncidentByReferenceUseCase.execute()`'s result (`T-C1-99` Trap 2):
 * the full Incident state on the success branch, the typed not-found outcome
 * on the failure branch — `@sport-itsm/shared-util`'s existing `Result`
 * (`T-C10-07`), not a bespoke discriminated union. Nothing about this
 * outcome needs more than `Result` already gives: exactly two branches, one
 * value each, no partial/pending state to model. Inventing a second
 * hand-rolled `{ found: true | false, ... }` type next to a `Result` the
 * kernel already exports would be pure duplication (DRY) for no gain in
 * expressiveness.
 */
export type GetIncidentByReferenceResult = Result<
  IncidentSnapshot,
  IncidentNotFoundOutcome
>;

/**
 * Reads a single Incident by its exact reference (`US-C1-01`, `FR-INC-01` —
 * the "see it" half of the slice). Nothing here writes: the only port this
 * class depends on is `IncidentReadRepositoryPort`, whose sole method cannot
 * mutate a row (`T-C1-99` AC3, Trap 1).
 *
 * **What reaches this use case (`T-C1-99` Trap 2).** A `TicketReference`,
 * already constructed — never a raw `string`. `TicketReference.fromString()`
 * and `IncidentReferencePolicy.parse()` both *throw* on a malformed or
 * wrong-prefix input; if this use case accepted a `string` and called either,
 * it would have to catch a thrown format error just to translate it into
 * something typed, for a concern (edge-shaped input validation) that belongs
 * to the HTTP adapter's DTO layer, not to a use case. `T-C1-100`'s controller
 * validates the path parameter's shape (`class-validator`, matching
 * `TicketReference`'s own pattern) and constructs the `TicketReference`
 * before calling this use case — the same split `LogIncidentUseCase` already
 * draws for `originChannel` (parsed at that use case's edge, not before it).
 * A reference with a foreign prefix (e.g. `SRQ0000001`) is deliberately
 * **not** special-cased here either: it simply matches no row in
 * `incident.incident_ticket`, so `findByReference()` returns `null` and this
 * use case reports `INCIDENT_NOT_FOUND` — true in every sense that matters to
 * a caller: there is no Incident with that reference. Distinguishing "wrong
 * record type" from "no such Incident" would be a second not-found reason
 * nothing in this ticket's Scope or AC asks for (YAGNI).
 *
 * **No authorization context (`T-C1-99` Trap 4 — decided, not omitted by
 * oversight).** Unlike `LogIncidentUseCase`, which gates on
 * `IncidentActor.canLogIncidentAsRequester()` before touching any port, this
 * use case has no predicate to evaluate yet: the Scope states plainly that
 * this slice has no scoped visibility and leaves the use case open to any
 * resolved actor. Adding an `actor`/context parameter today, only to carry it
 * unused, would be speculative generality this ticket has no requirement to
 * justify (YAGNI, `sport-itsm-engineering-principles`) — and worse, it would
 * invite a caller to *assume* some check already happens because the
 * parameter exists. **This is not a permanent decision.** The moment
 * `US-C1-06`'s visibility predicates exist, this use case's signature changes
 * to receive the actor/context it will need to gate on — a small, local,
 * additive change at this one call site, not a redesign. See the report's
 * findings for the tracked gap; no predicate is guessed at here.
 */
export class GetIncidentByReferenceUseCase {
  constructor(
    private readonly incidentReadRepository: IncidentReadRepositoryPort,
  ) {}

  async execute(
    reference: TicketReference,
  ): Promise<GetIncidentByReferenceResult> {
    const incident =
      await this.incidentReadRepository.findByReference(reference);

    if (incident === null) {
      return err({ reason: 'INCIDENT_NOT_FOUND', reference });
    }

    return ok(incident.toSnapshot());
  }
}
