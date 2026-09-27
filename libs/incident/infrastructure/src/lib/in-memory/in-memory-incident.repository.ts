import { Injectable } from '@nestjs/common';
import { Identity, TicketReference } from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentReadRepositoryPort,
  IncidentReferencePolicy,
  IncidentRepositoryPort,
} from '@sport-itsm/incident-domain';
import { IncidentEntity } from '../incident.entity';
import { IncidentMapper } from '../incident.mapper';
import {
  InMemoryIncidentReferenceImmutabilityError,
  InMemoryIncidentReferenceUniquenessError,
  InMemoryIncidentStoreCapacityExceededError,
} from './in-memory-incident-repository.errors';
import { generateUuidV7 } from './generate-uuid-v7';

/**
 * The maximum number of Incidents this process holds at once (`DATA-MODEL.md` §3.8): an
 * unauthenticated public URL backed by an unbounded `Map` is a memory-exhaustion vector.
 * Enforced on **insert** only — overwriting an already-known id never counts against it
 * (`T-C10-77` Trap 2).
 */
const CAPACITY_CEILING = 10_000;

/**
 * The second adapter behind `IncidentRepositoryPort` / `IncidentReadRepositoryPort`
 * (`ARCHITECTURE.md` ADR-015 decision 2, `DATA-MODEL.md` §3.8) — process memory instead of
 * PostgreSQL, for the stage prototype's `PERSISTENCE_MODE=memory` (no database on Render).
 * **A production adapter of the prototype, not a test double**: held to the same review
 * standard as `TypeOrmIncidentRepository`, whose *observable* contract it matches deliberately —
 * `null` on absence, a fresh aggregate instance on every read, no mutation shared with the
 * caller.
 *
 * Reuses `IncidentEntity` and `IncidentMapper` from this same library (`typeorm-incident.repository.ts`'s
 * neighbours): `typeorm` stays a decorator-only dependency here, never wired to any live
 * database connection (`T-C10-77` Trap 5 — see this file's own structural spec, which fails loudly
 * the moment this file's source names the ORM's connection class).
 *
 * **Binding is `T-C10-78`'s job, not this one's.** This class is exported from the library
 * barrel so a later composition root can construct it; nothing here reads `PERSISTENCE_MODE`,
 * and no token is bound to it in this ticket.
 *
 * **Not thread-safe by design, safely so.** Node's single-threaded event loop makes every method
 * body here run to completion without interleaving from another call — the counters and maps
 * below need no lock.
 *
 * **Restart resets everything** (`DATA-MODEL.md` §3.8, accepted risk of ADR-015): a new instance
 * starts `nextReference()` back at `INC0000001` and `nextIdentity()`/`save()` start from an empty
 * store. This is the ADR's own accepted trade-off, not a defect of this class.
 */
@Injectable()
export class InMemoryIncidentRepository
  implements IncidentRepositoryPort, IncidentReadRepositoryPort
{
  /** Incident id (`Identity.value`) → the stored row snapshot. */
  private readonly byId = new Map<string, IncidentEntity>();
  /** Incident reference (`TicketReference.value`) → the id it is indexed to. */
  private readonly idByReference = new Map<string, string>();
  /**
   * Never reused, never decremented (`DATA-MODEL.md` §3.2 "gaps acceptable, reuse never",
   * §3.8). Incremented **before** `IncidentReferencePolicy.format()` runs, so a value handed
   * out is consumed even when the following `save()` rejects it — matching
   * `TypeOrmIncidentRepository.nextReference()`'s own non-transactional `nextval()` semantics.
   */
  private referenceSequenceValue = 0;

  /**
   * A UUID v7 minted in-process (`T-C10-77` Trap 4) — see `generate-uuid-v7.ts`. No safety-net
   * default exists here the way `DEFAULT uuidv7()` backs up `TypeOrmIncidentRepository`
   * (`DATA-MODEL.md` §3.8): there is no other writer to back up.
   */
  async nextIdentity(): Promise<Identity> {
    return Identity.fromString(generateUuidV7());
  }

  /**
   * Reuses `IncidentReferencePolicy.format()` for the range check and rendering — this method
   * does not reimplement it. The 10,000,000th call (sequence value `10_000_000`) throws
   * `IncidentReferenceSequenceOutOfRangeError`, and every call after it does too: the counter
   * has already moved past `MAX_SEQUENCE_VALUE` and never comes back down.
   */
  async nextReference(): Promise<TicketReference> {
    this.referenceSequenceValue += 1;
    return IncidentReferencePolicy.format(this.referenceSequenceValue);
  }

  async findById(id: Identity): Promise<Incident | null> {
    const entity = this.byId.get(id.value);
    return entity ? IncidentMapper.toDomain(entity) : null;
  }

  async findByReference(reference: TicketReference): Promise<Incident | null> {
    const id = this.idByReference.get(reference.value);
    if (id === undefined) {
      return null;
    }
    const entity = this.byId.get(id);
    return entity ? IncidentMapper.toDomain(entity) : null;
  }

  /**
   * Insert or update, mirroring `TypeOrmIncidentRepository.save()`'s own contract. Three checks
   * stand in for what PostgreSQL would otherwise enforce (`DATA-MODEL.md` §3.8), all evaluated
   * **before** either the id-keyed map or the reference index is mutated — a rejected `save()`
   * leaves the store exactly as it was (`T-C10-77` AC5–AC7).
   *
   * **Order, decided and documented (`T-C10-77` Trap 2):**
   * 1. `IncidentMapper.toEntity()` — may itself throw `IncidentMappingError`; nothing is mutated
   *    yet either way.
   * 2. A **known** id (`this.byId.has(id)`): the stored `reference` must match the new one
   *    (immutability), or the save is rejected. A matching reference overwrites the stored
   *    snapshot — still one row, never counted against the capacity ceiling no matter how full
   *    the store already is.
   * 3. A **new** id: the new `reference` must not already be indexed to a *different* id
   *    (uniqueness), and the store must have room (capacity). Both are structural rules a real
   *    database enforces on every insert; a known id never needs them re-checked because it was
   *    already accepted once.
   */
  async save(incident: Incident): Promise<void> {
    const entity = IncidentMapper.toEntity(incident);
    const id = entity.id;
    const reference = entity.reference;

    const storedEntity = this.byId.get(id);
    if (storedEntity) {
      if (storedEntity.reference !== reference) {
        throw new InMemoryIncidentReferenceImmutabilityError(
          id,
          storedEntity.reference,
          reference,
        );
      }
    } else {
      const idIndexedForReference = this.idByReference.get(reference);
      if (idIndexedForReference !== undefined && idIndexedForReference !== id) {
        throw new InMemoryIncidentReferenceUniquenessError(
          reference,
          idIndexedForReference,
          id,
        );
      }
      if (this.byId.size >= CAPACITY_CEILING) {
        throw new InMemoryIncidentStoreCapacityExceededError(
          this.byId.size,
          CAPACITY_CEILING,
        );
      }
    }

    this.byId.set(id, InMemoryIncidentRepository.cloneForStorage(entity));
    this.idByReference.set(reference, id);
  }

  /**
   * A defensive copy of the mapped row, stored instead of the object `IncidentMapper.toEntity()`
   * handed back (`T-C10-77` Trap 3). `IncidentEntity.createdAt` / `.updatedAt` are `Date`
   * instances — mutable even once the entity object that holds them is frozen, since freezing a
   * container does not freeze the values inside it. Cloning both into fresh `Date` instances
   * before storing, then freezing the clone, means nothing this class stores ever aliases a
   * `Date` (or the entity object itself) that anything outside this class can reach — there is
   * no path back to the stored snapshot for a caller to mutate, because `findById()` /
   * `findByReference()` never return the entity itself, only a freshly reconstituted `Incident`
   * built from its primitive fields (`IncidentMapper.toDomain()`).
   */
  private static cloneForStorage(entity: IncidentEntity): IncidentEntity {
    const clone = new IncidentEntity();
    clone.id = entity.id;
    clone.reference = entity.reference;
    clone.shortDescription = entity.shortDescription;
    clone.description = entity.description;
    clone.originChannel = entity.originChannel;
    clone.reporterUserId = entity.reporterUserId;
    clone.serviceId = entity.serviceId;
    clone.createdAt = new Date(entity.createdAt.getTime());
    clone.updatedAt = new Date(entity.updatedAt.getTime());
    clone.createdBy = entity.createdBy;
    clone.updatedBy = entity.updatedBy;
    clone.version = entity.version;
    return Object.freeze(clone);
  }
}
