import { Identity, TicketReference } from '@sport-itsm/shared-domain';
import { Incident } from './incident.aggregate';

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
 * `findById()` and `save()` were intentionally **not** declared by `T-C1-03`:
 * both name `Incident`, which did not exist until this ticket (`T-C1-05`)
 * built it — see that ticket's reported deviation from the `T-C1-03` Scope
 * for why this was a deliberate split rather than an omission. `T-C1-05`
 * completes the port with both methods now that `Incident` exists to type
 * them; wiring a concrete adapter (`T-C1-06`) and calling either method from
 * a use case (`T-C1-07`) remain out of this ticket's scope.
 */
export interface IncidentRepositoryPort {
  /** A fresh, never-reused UUID v7 for a new Incident aggregate. */
  nextIdentity(): Promise<Identity>;

  /** A fresh, never-reused human-readable reference for a new Incident. */
  nextReference(): Promise<TicketReference>;

  /** The Incident with this identity, or `null` when none exists. */
  findById(id: Identity): Promise<Incident | null>;

  /** Persists the given Incident, insert or update (`T-C1-06` owns the mapping). */
  save(incident: Incident): Promise<void>;
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
