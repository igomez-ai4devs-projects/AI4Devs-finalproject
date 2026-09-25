import { Identity, TicketReference } from '@sport-itsm/shared-domain';

/**
 * The outbound port through which the Incident context reaches persistence
 * (`ARCHITECTURE.md` §6.2, §6.3). Declared here as an `interface`, bound to a
 * concrete adapter only in `apps/api` — this library never imports the
 * adapter.
 *
 * `nextIdentity()` and `nextReference()` both return values the aggregate
 * needs to exist at all, and both are I/O: an identity is a UUID v7 the
 * adapter has no reason to mint outside the database round-trip that also
 * reserves the reference, and a reference is `nextval('incident.incident_reference_seq')`
 * rendered through `IncidentReferencePolicy` (`DATA-MODEL.md` §3.1 — "`nextIdentity()`
 * alongside the existing `nextReference()`" — and §3.2). Naming both here, now,
 * invents no type the port cannot honor: `Identity` and `TicketReference` are
 * already kernel types, unlike the aggregate itself.
 *
 * `findById()` and `save()` are intentionally **not** declared yet. Both name
 * `Incident`, the aggregate this ticket does not build (`T-C1-05` owns it) —
 * adding either now, even as a placeholder, would mean either inventing a
 * throwaway type `T-C1-05` has to delete, or importing an aggregate that does
 * not exist. `T-C1-05` extends this interface with both methods once
 * `Incident` exists to type them; see the ticket's reported deviation from the
 * `T-C1-03` Scope for why this is a deliberate split rather than an omission.
 */
export interface IncidentRepositoryPort {
  /** A fresh, never-reused UUID v7 for a new Incident aggregate. */
  nextIdentity(): Promise<Identity>;

  /** A fresh, never-reused human-readable reference for a new Incident. */
  nextReference(): Promise<TicketReference>;
}

/**
 * The injection token for `IncidentRepositoryPort` — the interface is erased
 * at runtime, so the NestJS composition root in `apps/api` needs a value to
 * key the binding on (`ARCHITECTURE.md` §6.3), the same pattern as
 * `EVENT_PUBLISHER` beside `EventPublisherPort` in the shared kernel. A
 * `Symbol` is plain JavaScript: it names the dependency without importing any
 * framework into this domain library.
 */
export const INCIDENT_REPOSITORY = Symbol('IncidentRepositoryPort');
