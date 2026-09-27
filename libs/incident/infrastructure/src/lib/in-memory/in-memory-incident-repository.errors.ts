import { describeValue } from '@sport-itsm/shared-domain';

/**
 * The three typed errors `InMemoryIncidentRepository.save()` raises in place of a database
 * constraint (`T-C10-77` Scope, Trap 2). **None is a `DomainError`** — the same reasoning
 * `IncidentMappingError` states for itself (`incident-mapping.error.ts`): a broken `uq_incident_reference`,
 * a rejected reference-immutability update or an exhausted process are persistence-layer facts,
 * not a broken `Incident` invariant. Each `extends Error` directly and sets `name` explicitly, so
 * `GlobalExceptionFilter` — which maps `DomainError` subtypes but leaves every other `Error` to its
 * generic `INTERNAL_ERROR` envelope — treats them exactly like a PostgreSQL constraint violation
 * bubbling up through `TypeOrmIncidentRepository`, with no new contract error code and no filter
 * change (`T-C10-77` Restricciones, "Lee antes").
 */

/**
 * Raised when `save()` is given a second Incident whose `reference` is already indexed to a
 * different id (`DATA-MODEL.md` §3.2 `uq_incident_reference`, reimplemented in `§3.8` for the
 * `memory` persistence mode). The store is left exactly as it was — this is thrown before either
 * the id-keyed map or the reference index is touched.
 */
export class InMemoryIncidentReferenceUniquenessError extends Error {
  constructor(
    readonly offendingReference: string,
    readonly existingIncidentId: string,
    readonly rejectedIncidentId: string,
  ) {
    super(
      `Incident reference ${describeValue(offendingReference)} is already indexed to id ` +
        `${describeValue(existingIncidentId)}; cannot save a different id ` +
        `(${describeValue(rejectedIncidentId)}) under the same reference.`,
    );
    this.name = 'InMemoryIncidentReferenceUniquenessError';
  }
}

/**
 * Raised when `save()` is given a known Incident id whose `reference` differs from the one
 * already stored (`DATA-MODEL.md` §3.2, the `tg_incident_ticket_reference_immutable` guard
 * trigger, reimplemented in `§3.8` for the `memory` persistence mode). The stored snapshot is
 * left exactly as it was — this is thrown before the id-keyed map is mutated.
 */
export class InMemoryIncidentReferenceImmutabilityError extends Error {
  constructor(
    readonly incidentId: string,
    readonly storedReference: string,
    readonly rejectedReference: string,
  ) {
    super(
      `Incident ${describeValue(incidentId)} was stored with reference ` +
        `${describeValue(storedReference)}; cannot overwrite it with a different reference ` +
        `(${describeValue(rejectedReference)}) — a reference is immutable once persisted.`,
    );
    this.name = 'InMemoryIncidentReferenceImmutabilityError';
  }
}

/**
 * Raised when `save()` would insert past the 10,000-Incident capacity ceiling
 * (`DATA-MODEL.md` §3.8: "unauthenticated public URL, unbounded map is a memory-exhaustion
 * vector"). Only a **new** id counts against the ceiling — overwriting a known id never does, no
 * matter how many Incidents are already stored (`T-C10-77` Trap 2).
 */
export class InMemoryIncidentStoreCapacityExceededError extends Error {
  constructor(
    readonly currentSize: number,
    readonly capacityCeiling: number,
  ) {
    super(
      `In-memory Incident store is at capacity (${describeValue(currentSize)}/${describeValue(capacityCeiling)}); ` +
        'cannot save a new Incident until the process restarts.',
    );
    this.name = 'InMemoryIncidentStoreCapacityExceededError';
  }
}
