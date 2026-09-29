import { Identity, TicketReference } from '@sport-itsm/shared-domain';
import { Incident, OriginChannel } from '@sport-itsm/incident-domain';
import { IncidentEntity } from './incident.entity';
import { IncidentMappingError } from './incident-mapping.error';

/**
 * The one object that knows both the `Incident` aggregate
 * (`libs/incident/domain`) and `IncidentEntity` (this library) — ADR-005's
 * explicit mapper, and `T-C1-06` AC3's proof that no TypeORM decorator ever
 * needs to reach the domain library.
 *
 * Stateless by design (YAGNI): a static utility, like `IncidentReferencePolicy`.
 */
export class IncidentMapper {
  private constructor() {
    // Not instantiable: every member is static, there is no state to hold.
  }

  /**
   * Aggregate → row, for `TypeOrmIncidentRepository.save()`.
   *
   * `created_at` / `created_by` are read from the aggregate's
   * `loggedAtEpochMs` / `loggedBy` — never from a separate persistence-only
   * clock read (ADR-014 rule 4, `T-C1-06` Scope). `updated_at` is set to the
   * same instant and `updated_by` is left `null` on this, the first save a
   * newly logged Incident ever receives: no domain event or mutation has
   * touched the aggregate since `log()` produced it, so there is no "last
   * writer" or "last update instant" to persist yet, and inventing one (e.g.
   * a fresh `new Date()` read here) would be exactly the "persistence
   * invents domain state" ADR-014 rule 4 forbids. A later ticket that adds a
   * real mutation (`categorize()`, `assign()`, …) sets both explicitly from
   * that mutation's own `ClockPort` / actor, the same way this method sets
   * them from `log()`'s.
   *
   * @throws {IncidentMappingError} when the aggregate carries a value in a
   * slot `incident_ticket` has no column for yet (`T-C1-06` Scope, ADR-014
   * rule 4) — never a silently dropped value.
   */
  static toEntity(incident: Incident): IncidentEntity {
    IncidentMapper.assertNoUnmappedState(incident);

    const entity = new IncidentEntity();
    entity.id = incident.id.value;
    entity.reference = incident.reference.value;
    entity.shortDescription = incident.shortDescription;
    entity.description = incident.description;
    entity.originChannel = incident.originChannel.code;
    entity.reporterUserId = incident.reporterId.value;
    entity.serviceId = incident.affectedServiceId?.value ?? null;
    entity.createdAt = new Date(incident.loggedAtEpochMs);
    entity.updatedAt = new Date(incident.loggedAtEpochMs);
    entity.createdBy = incident.loggedBy.value;
    entity.updatedBy = null;
    return entity;
  }

  /**
   * Row → aggregate, for `TypeOrmIncidentRepository.findById()`.
   *
   * Goes through {@link Incident.reconstitute}, not {@link Incident.log}:
   * reloading a row is not a new occurrence of "an Incident was logged"
   * (`Incident.reconstitute`'s own doc comment, `T-C1-06` Trap 6). Every slot
   * this migration has no column for yet (`categoryId`, `impact`, `urgency`,
   * `priority`, `competitionAffectsInProgress`, `affectedSubject`,
   * `assignment`) is read back as `null` / `false` — the shape ADR-014 and
   * `DATA-MODEL.md` §8.5 declare for a just-logged Incident.
   */
  static toDomain(entity: IncidentEntity): Incident {
    return Incident.reconstitute({
      id: Identity.fromString(entity.id),
      reference: TicketReference.fromString(entity.reference),
      loggedAtEpochMs: entity.createdAt.getTime(),
      loggedBy: Identity.fromString(entity.createdBy),
      reporterId: Identity.fromString(entity.reporterUserId),
      originChannel: OriginChannel.fromCode(entity.originChannel),
      shortDescription: entity.shortDescription,
      description: entity.description,
      affectedServiceId: entity.serviceId
        ? Identity.fromString(entity.serviceId)
        : null,
      categoryId: null,
      impact: null,
      urgency: null,
      priority: null,
      competitionAffectsInProgress: false,
      affectedSubject: null,
      assignment: null,
    });
  }

  /**
   * The mapper's side of ADR-014 rule 4 (`T-C1-06` Scope). Guard-clause style,
   * one check per slot, each raising its own {@link IncidentMappingError}
   * naming the offending field — never a generic "cannot map" with no
   * indication of which value was the problem.
   */
  private static assertNoUnmappedState(incident: Incident): void {
    if (incident.categoryId !== null) {
      throw new IncidentMappingError('categoryId', incident.categoryId);
    }
    if (incident.impact !== null) {
      throw new IncidentMappingError('impact', incident.impact);
    }
    if (incident.urgency !== null) {
      throw new IncidentMappingError('urgency', incident.urgency);
    }
    if (incident.priority !== null) {
      throw new IncidentMappingError('priority', incident.priority);
    }
    if (incident.competitionAffectsInProgress !== false) {
      throw new IncidentMappingError(
        'competitionAffectsInProgress',
        incident.competitionAffectsInProgress,
      );
    }
    if (incident.affectedSubject !== null) {
      throw new IncidentMappingError(
        'affectedSubject',
        incident.affectedSubject,
      );
    }
    if (incident.assignment !== null) {
      throw new IncidentMappingError('assignment', incident.assignment);
    }
  }
}
