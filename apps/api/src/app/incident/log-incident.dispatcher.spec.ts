import {
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentReferencePolicy,
  IncidentRepositoryPort,
  SlaPolicyPort,
} from '@sport-itsm/incident-domain';
import {
  IncidentActor,
  LogIncidentInput,
  LogIncidentUseCase,
} from '@sport-itsm/incident-application';
import { InProcessEventDispatcher } from '../../event-dispatch/in-process-event-dispatcher';

/**
 * `T-C1-07` AC3, composed with the **real** dispatcher rather than a stub
 * (`T-C1-07` Trap 6): the isolation `IncidentLogged` needs is a guarantee of
 * `InProcessEventDispatcher` (`T-C10-73`), which lives in `apps/api` — a
 * `libs/incident/application` spec cannot import it (`type:application` may
 * not depend on `type:app`, ARCHITECTURE.md §5.3). This file lives here
 * instead, composing the real use case with the real dispatcher, an
 * in-memory repository and a benign SLA stub, so no database and no HTTP are
 * needed (AC4 still holds for this composition too).
 */

const REPORTER_IDENTITY = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abe',
);
const ALLOCATED_IDENTITY = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abc',
);
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

class AllowedRequesterActor implements IncidentActor {
  readonly identity = REPORTER_IDENTITY;

  canLogIncidentAsRequester(): boolean {
    return true;
  }
}

/** An in-memory adapter, the same shape `T-C1-06`'s own port spec uses. */
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

const VALID_INPUT: LogIncidentInput = {
  originChannel: 'portal',
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
};

describe('LogIncidentUseCase composed with the real InProcessEventDispatcher (AC3)', () => {
  it('keeps the Incident persisted and reports success even though the IncidentLogged subscriber throws', async () => {
    const repository = new InMemoryIncidentRepository();
    const dispatcher = new InProcessEventDispatcher();
    const failingSubscriber = jest.fn((): void => {
      throw new Error('notification gateway unreachable');
    });
    dispatcher.subscribe('IncidentLogged', failingSubscriber);

    const useCase = new LogIncidentUseCase(
      repository,
      new NoopSlaPolicy(),
      dispatcher,
      CLOCK,
    );

    const result = await useCase.execute(VALID_INPUT, {
      actor: new AllowedRequesterActor(),
      correlationId: 'req-ac3-001',
    });

    expect(failingSubscriber).toHaveBeenCalledTimes(1);
    const persisted = await repository.findById(result.id);
    expect(persisted).not.toBeNull();
    expect(persisted?.reference.equals(result.reference)).toBe(true);
    expect(persisted?.reporterId.equals(REPORTER_IDENTITY)).toBe(true);
  });
});
