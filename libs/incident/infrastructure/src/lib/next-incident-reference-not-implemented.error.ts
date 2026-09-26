/**
 * Raised by `TypeOrmIncidentRepository.nextReference()`, which this ticket
 * (`T-C1-06`) implements the rest of `IncidentRepositoryPort` around but
 * deliberately does not implement itself.
 *
 * `incident.incident_reference_seq` — the only source `IncidentReferencePolicy`
 * accepts for the numeric part of a reference (`DATA-MODEL.md` §3.2) — is
 * created by **`T-C1-04`**, which runs after this ticket in the build order
 * (`T-C1-03 → T-C1-05 → T-C1-06 → T-C1-04`, this ticket's own `## Context`).
 * Inventing a provisional counter or sequence here would contradict "never
 * reused" the moment the real sequence replaced it, so this method fails
 * loudly instead of faking the mechanism `T-C1-04` owns.
 *
 * Not a `DomainError`: like `IncidentMappingError`, this is an infrastructure
 * capability gap, not a broken domain invariant.
 */
export class NextIncidentReferenceNotImplementedError extends Error {
  constructor() {
    super(
      'TypeOrmIncidentRepository.nextReference() is not implemented: ' +
        'incident.incident_reference_seq does not exist until T-C1-04. ' +
        'This ticket (T-C1-06) only wires the rest of IncidentRepositoryPort.',
    );
    this.name = 'NextIncidentReferenceNotImplementedError';
  }
}
