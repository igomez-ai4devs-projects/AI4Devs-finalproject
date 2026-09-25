import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  INCIDENT_REPOSITORY,
  IncidentRepositoryPort,
} from './incident-repository.port';
import { INCIDENT_REPOSITORY as BARREL_INCIDENT_REPOSITORY } from '../index';
import { IncidentReferencePolicy } from './incident-reference.policy';
import { Incident } from './incident.aggregate';
import { OriginChannel } from './origin-channel.vo';

const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

/** The port is an interface; this is the smallest thing that can satisfy it. */
class InMemoryIncidentRepository implements IncidentRepositoryPort {
  private nextSequenceValue = 1;
  private readonly incidentsById = new Map<string, Incident>();

  async nextIdentity(): Promise<Identity> {
    return Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
  }

  async nextReference(): Promise<TicketReference> {
    return IncidentReferencePolicy.format(this.nextSequenceValue++);
  }

  async findById(id: Identity): Promise<Incident | null> {
    return this.incidentsById.get(id.value) ?? null;
  }

  async save(incident: Incident): Promise<void> {
    this.incidentsById.set(incident.id.value, incident);
  }
}

describe('IncidentRepositoryPort', () => {
  it('is satisfiable by an adapter that issues a fresh identity with no database or HTTP', async () => {
    const repository = new InMemoryIncidentRepository();

    const identity = await repository.nextIdentity();

    expect(identity).toBeInstanceOf(Identity);
  });

  it('is satisfiable by an adapter that issues a fresh, well-formed reference', async () => {
    const repository = new InMemoryIncidentRepository();

    const reference = await repository.nextReference();

    expect(reference).toBeInstanceOf(TicketReference);
    expect(reference.value).toMatch(/^INC[0-9]{7}$/);
  });

  it('exports a Symbol injection token beside the port, reachable from the barrel', () => {
    expect(typeof INCIDENT_REPOSITORY).toBe('symbol');
    expect(INCIDENT_REPOSITORY).toBe(BARREL_INCIDENT_REPOSITORY);
  });

  it('is satisfiable by an adapter whose findById() reports no Incident before one is saved', async () => {
    const repository = new InMemoryIncidentRepository();
    const identity = await repository.nextIdentity();

    const found = await repository.findById(identity);

    expect(found).toBeNull();
  });

  it('is satisfiable by an adapter that persists an Incident and returns it from findById()', async () => {
    const repository = new InMemoryIncidentRepository();
    const id = await repository.nextIdentity();
    const reference = await repository.nextReference();
    const { incident } = Incident.log({
      id,
      reference,
      reporterId: REPORTER,
      originChannel: OriginChannel.fromCode('portal'),
      shortDescription: 'Cannot submit match roster',
      description: 'The roster submission form rejects a valid squad list.',
      actor: ACTOR,
      correlationId: 'req-3f8a10c2',
      occurredAt: CLOCK.now(),
    });

    await repository.save(incident);
    const found = await repository.findById(id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(id)).toBe(true);
    expect(found?.reference.equals(reference)).toBe(true);
  });
});
