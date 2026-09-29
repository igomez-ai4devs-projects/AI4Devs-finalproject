import { describeValue } from '@sport-itsm/shared-domain';

/**
 * Raised by `IncidentMapper.toEntity()` when the aggregate carries a value in
 * a slot `incident.incident_ticket` has no column for yet (`categoryId`,
 * `impact`, `urgency`, `priority`, `competitionAffectsInProgress`,
 * `affectedSubject`, `assignment` — `T-C1-06` Scope, ADR-014 rule 4,
 * `DATA-MODEL.md` §8.5).
 *
 * **Not a `DomainError`.** `DomainError` (`shared-domain`) names a broken
 * *domain* invariant — a value object or aggregate rejecting its own input.
 * This is a persistence-layer contract violation: the aggregate itself is
 * perfectly valid, it simply carries state this migration's table cannot
 * represent yet. Conflating the two would let a caller catch "the aggregate
 * is invalid" and "the schema hasn't caught up with the aggregate" as the
 * same failure, which they are not.
 *
 * Deliberately thrown, never a silently dropped value: ADR-014 rule 4
 * requires exactly that ("persistence never invents domain state" cuts both
 * ways — it also refuses to *erase* state the aggregate actually holds).
 */
export class IncidentMappingError extends Error {
  constructor(
    readonly offendingField: string,
    readonly offendingValue: unknown,
  ) {
    super(
      `Cannot map Incident to incident_ticket: "${offendingField}" is not empty ` +
        `(${describeValue(offendingValue)}), but incident_ticket has no column for it yet ` +
        `(DATA-MODEL.md §8.5 — this column group arrives with a later migration).`,
    );
    this.name = 'IncidentMappingError';
  }
}
