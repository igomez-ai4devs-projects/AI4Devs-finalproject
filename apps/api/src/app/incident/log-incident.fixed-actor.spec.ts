import { Test } from '@nestjs/testing';
import {
  EventPublisherPort,
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentReferencePolicy,
  IncidentRepositoryPort,
  INCIDENT_REPOSITORY,
  SlaPolicyPort,
} from '@sport-itsm/incident-domain';
import {
  LogIncidentInput,
  LogIncidentUseCase,
} from '@sport-itsm/incident-application';
import { BOOTSTRAP_REQUESTER_ID } from '../../bootstrap/bootstrap-identities';
import { IncidentModule } from './incident.module';
import {
  INCIDENT_ACTOR_RESOLVER,
  IncidentActorResolver,
} from './incident-actor-resolver';

/**
 * `T-C10-74` AC3: "`T-C1-07` executes against this fixed `Actor` exactly as
 * it would against any resolved `Actor`, with no change to its own file."
 *
 * The `IncidentActor` this test hands to `LogIncidentUseCase` is obtained
 * from `IncidentModule`'s own `INCIDENT_ACTOR_RESOLVER` binding — resolved
 * through the real production wiring (`IncidentModule`), never by
 * hand-instantiating `FixedRequesterActorResolver`. Only
 * `INCIDENT_REPOSITORY` is overridden, so this test needs no PostgreSQL
 * connection: `TypeOrmIncidentRepository` (`IncidentModule`'s other
 * provider) depends on a live `DataSource` this suite has no reason to open.
 *
 * `git diff libs/incident/application` staying empty is the other half of
 * this AC — this file only ever imports from that library's public barrel,
 * never edits it.
 */

const ALLOCATED_IDENTITY = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abd',
);
const CLOCK = FixedClock.at(new Date('2026-09-26T09:00:00.000Z'));

/** An in-memory adapter, the same shape `T-C1-07`'s own AC3 spec uses. */
class InMemoryIncidentRepository implements IncidentRepositoryPort {
  private nextSequenceValue = 1;
  private readonly incidentsById = new Map<string, Incident>();

  async nextIdentity(): Promise<Identity> {
    return ALLOCATED_IDENTITY;
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

/** Provisional until `T-C1-58` binds the real adapter — see `SlaPolicyPort`'s own doc comment. */
class NoopSlaPolicy implements SlaPolicyPort {
  async attachFor(): Promise<void> {
    // Intentionally empty: no real SLA adapter exists before T-C1-58.
  }
}

/** Provisional stub — this test only asserts on persistence and authorization, not on dispatch. */
class NoopEventPublisher implements EventPublisherPort {
  publish(): void {
    // Intentionally empty: event dispatch is out of this test's scope.
  }
}

const VALID_INPUT: LogIncidentInput = {
  originChannel: 'portal',
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
};

describe('LogIncidentUseCase composed with IncidentModule’s fixed actor binding (T-C10-74 AC3)', () => {
  it('authorizes and persists exactly as it would against any resolved Actor', async () => {
    const repository = new InMemoryIncidentRepository();

    const moduleRef = await Test.createTestingModule({
      imports: [IncidentModule],
    })
      .overrideProvider(INCIDENT_REPOSITORY)
      .useValue(repository)
      .compile();

    const actorResolver = moduleRef.get<IncidentActorResolver>(
      INCIDENT_ACTOR_RESOLVER,
    );
    const actor = await actorResolver.resolveActor();

    const useCase = new LogIncidentUseCase(
      repository,
      new NoopSlaPolicy(),
      new NoopEventPublisher(),
      CLOCK,
    );

    const result = await useCase.execute(VALID_INPUT, {
      actor,
      correlationId: 'req-t-c10-74-ac3-001',
    });

    const persisted = await repository.findById(result.id);
    expect(persisted).not.toBeNull();
    expect(persisted?.reporterId.equals(BOOTSTRAP_REQUESTER_ID)).toBe(true);
    expect(persisted?.loggedBy.equals(BOOTSTRAP_REQUESTER_ID)).toBe(true);

    await moduleRef.close();
  });
});
