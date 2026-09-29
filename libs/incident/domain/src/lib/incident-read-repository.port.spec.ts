import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  INCIDENT_READ_REPOSITORY,
  IncidentReadRepositoryPort,
} from './incident-read-repository.port';
import { INCIDENT_READ_REPOSITORY as BARREL_INCIDENT_READ_REPOSITORY } from '../index';
import { IncidentReferencePolicy } from './incident-reference.policy';
import { Incident } from './incident.aggregate';
import { OriginChannel } from './origin-channel.vo';
import {
  INCIDENT_REPOSITORY,
  IncidentRepositoryPort,
} from './incident-repository.port';

const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

/** The port is an interface; this is the smallest thing that can satisfy it — one method, nothing that writes. */
class InMemoryIncidentReadRepository implements IncidentReadRepositoryPort {
  private readonly incidentsByReference = new Map<string, Incident>();

  seed(incident: Incident): void {
    this.incidentsByReference.set(incident.reference.value, incident);
  }

  async findByReference(reference: TicketReference): Promise<Incident | null> {
    return this.incidentsByReference.get(reference.value) ?? null;
  }
}

describe('IncidentReadRepositoryPort', () => {
  it('exports a Symbol injection token beside the port, reachable from the barrel', () => {
    expect(typeof INCIDENT_READ_REPOSITORY).toBe('symbol');
    expect(INCIDENT_READ_REPOSITORY).toBe(BARREL_INCIDENT_READ_REPOSITORY);
    // A distinct token from the write port's own (see this file's doc
    // comment) — asserted here so the two never silently collapse into one.
    expect(INCIDENT_READ_REPOSITORY).not.toBe(INCIDENT_REPOSITORY);
  });

  it('is satisfiable by an adapter whose findByReference() reports no Incident before one exists', async () => {
    const repository = new InMemoryIncidentReadRepository();

    const found = await repository.findByReference(
      IncidentReferencePolicy.format(1),
    );

    expect(found).toBeNull();
  });

  it('is satisfiable by an adapter that returns a previously seeded Incident by its exact reference', async () => {
    const repository = new InMemoryIncidentReadRepository();
    const reference = IncidentReferencePolicy.format(7);
    const { incident } = Incident.log({
      id: Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc'),
      reference,
      reporterId: REPORTER,
      originChannel: OriginChannel.fromCode('portal'),
      shortDescription: 'Cannot submit match roster',
      description: 'The roster submission form rejects a valid squad list.',
      actor: ACTOR,
      correlationId: 'req-1',
      occurredAt: CLOCK.now(),
    });
    repository.seed(incident);

    const found = await repository.findByReference(reference);

    expect(found?.reference.equals(reference)).toBe(true);
  });

  /**
   * `IncidentRepositoryPort` (`T-C1-05`/`T-C1-06`) and this interface are
   * **independent** — neither extends the other (`T-C1-99` Trap 1: extending
   * would have widened every existing `IncidentRepositoryPort` implementer,
   * including test doubles in `apps/api`, which this ticket may not touch).
   * This is the compile-time proof: a single class can implement both without
   * either requiring the other's members, the same way
   * `TypeOrmIncidentRepository` (`libs/incident/infrastructure`) does.
   */
  it('composes with the independent write port — a single adapter can implement both with no inheritance between them', async () => {
    class DualPortRepository
      implements IncidentReadRepositoryPort, IncidentRepositoryPort
    {
      private readonly incidentsByReference = new Map<string, Incident>();

      async nextIdentity(): Promise<Identity> {
        return Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
      }
      async nextReference(): Promise<TicketReference> {
        return IncidentReferencePolicy.format(1);
      }
      async findById(): Promise<Incident | null> {
        return null;
      }
      async findByReference(
        reference: TicketReference,
      ): Promise<Incident | null> {
        return this.incidentsByReference.get(reference.value) ?? null;
      }
      async save(): Promise<void> {
        // no-op: this class exists only to prove the type composes.
      }
    }
    const repository = new DualPortRepository();

    const found = await repository.findByReference(
      IncidentReferencePolicy.format(1),
    );

    expect(found).toBeNull();
    expect(INCIDENT_REPOSITORY).not.toBe(INCIDENT_READ_REPOSITORY);
  });
});
