import { Identity, TicketReference } from '@sport-itsm/shared-domain';
import {
  INCIDENT_REPOSITORY,
  IncidentRepositoryPort,
} from './incident-repository.port';
import { INCIDENT_REPOSITORY as BARREL_INCIDENT_REPOSITORY } from '../index';
import { IncidentReferencePolicy } from './incident-reference.policy';

/** The port is an interface; this is the smallest thing that can satisfy it. */
class InMemoryIncidentRepository implements IncidentRepositoryPort {
  private nextSequenceValue = 1;

  async nextIdentity(): Promise<Identity> {
    return Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
  }

  async nextReference(): Promise<TicketReference> {
    return IncidentReferencePolicy.format(this.nextSequenceValue++);
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
});
