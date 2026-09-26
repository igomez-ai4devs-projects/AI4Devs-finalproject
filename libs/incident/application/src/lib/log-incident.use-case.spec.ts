import {
  ClockPort,
  DomainEvent,
  EventPublisherPort,
  FixedClock,
  Identity,
  TicketReference,
} from '@sport-itsm/shared-domain';
import {
  Incident,
  IncidentRepositoryPort,
  IncidentReferencePolicy,
  SlaPolicyPort,
} from '@sport-itsm/incident-domain';
import { IncidentActor, IncidentLogAuthorizationError } from './incident-actor';
import {
  LogIncidentContext,
  LogIncidentInput,
  LogIncidentUseCase,
} from './log-incident.use-case';

const ACTOR_IDENTITY = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abe',
);
const ALLOCATED_IDENTITY = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abc',
);
const ALLOCATED_REFERENCE = IncidentReferencePolicy.format(1);
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));
const CORRELATION_ID = 'req-3f8a10c2';

/** Records every port call, in order, so tests can assert sequencing (Trap 5). */
class CallLog {
  readonly calls: string[] = [];
  record(step: string): void {
    this.calls.push(step);
  }
}

/** The smallest `IncidentActor` that can satisfy the interface. */
class StubActor implements IncidentActor {
  constructor(
    readonly identity: Identity,
    private readonly authorized: boolean,
  ) {}

  canLogIncidentAsRequester(): boolean {
    return this.authorized;
  }
}

/** A repository stub that records call order and never touches a database. */
class StubIncidentRepository implements IncidentRepositoryPort {
  saveError: Error | null = null;
  readonly saved: Incident[] = [];

  constructor(private readonly callLog: CallLog) {}

  async nextIdentity(): Promise<Identity> {
    this.callLog.record('nextIdentity');
    return ALLOCATED_IDENTITY;
  }

  async nextReference(): Promise<TicketReference> {
    this.callLog.record('nextReference');
    return ALLOCATED_REFERENCE;
  }

  async findById(): Promise<Incident | null> {
    throw new Error('not used by this use case');
  }

  async save(incident: Incident): Promise<void> {
    this.callLog.record('save');
    if (this.saveError) {
      throw this.saveError;
    }
    this.saved.push(incident);
  }
}

/** A benign SLA stub (`T-C1-07` Scope: "tolerates an unbound adapter in tests through a stub"). */
class StubSlaPolicy implements SlaPolicyPort {
  attachError: Error | null = null;
  readonly attachedTo: Incident[] = [];

  constructor(private readonly callLog: CallLog) {}

  async attachFor(incident: Incident): Promise<void> {
    this.callLog.record('attachFor');
    if (this.attachError) {
      throw this.attachError;
    }
    this.attachedTo.push(incident);
  }
}

class RecordingEventPublisher implements EventPublisherPort {
  readonly published: DomainEvent<object>[][] = [];

  constructor(private readonly callLog: CallLog) {}

  publish(events: readonly DomainEvent<object>[]): void {
    this.callLog.record('publish');
    this.published.push([...events]);
  }
}

class RecordingClock implements ClockPort {
  constructor(private readonly callLog: CallLog) {}

  now(): Date {
    this.callLog.record('clock.now');
    return CLOCK.now();
  }
}

const VALID_INPUT: LogIncidentInput = {
  originChannel: 'portal',
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
};

describe('LogIncidentUseCase', () => {
  let callLog: CallLog;
  let incidentRepository: StubIncidentRepository;
  let slaPolicy: StubSlaPolicy;
  let eventPublisher: RecordingEventPublisher;
  let clock: RecordingClock;
  let useCase: LogIncidentUseCase;

  const contextFor = (actor: IncidentActor): LogIncidentContext => ({
    actor,
    correlationId: CORRELATION_ID,
  });

  beforeEach(() => {
    callLog = new CallLog();
    incidentRepository = new StubIncidentRepository(callLog);
    slaPolicy = new StubSlaPolicy(callLog);
    eventPublisher = new RecordingEventPublisher(callLog);
    clock = new RecordingClock(callLog);
    useCase = new LogIncidentUseCase(
      incidentRepository,
      slaPolicy,
      eventPublisher,
      clock,
    );
  });

  describe('AC1 — a valid command persists the Incident and publishes exactly once after commit', () => {
    it('persists the Incident with its allocated reference and the actor as reporter', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);

      const result = await useCase.execute(VALID_INPUT, contextFor(actor));

      expect(result.id.equals(ALLOCATED_IDENTITY)).toBe(true);
      expect(result.reference.equals(ALLOCATED_REFERENCE)).toBe(true);
      expect(incidentRepository.saved).toHaveLength(1);
      expect(
        incidentRepository.saved[0].reporterId.equals(ACTOR_IDENTITY),
      ).toBe(true);
      expect(incidentRepository.saved[0].loggedBy.equals(ACTOR_IDENTITY)).toBe(
        true,
      );
    });

    it('publishes exactly one IncidentLogged event, and only after save() has resolved', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);

      await useCase.execute(VALID_INPUT, contextFor(actor));

      expect(eventPublisher.published).toHaveLength(1);
      expect(eventPublisher.published[0]).toHaveLength(1);
      expect(eventPublisher.published[0][0].name).toBe('IncidentLogged');
      const saveIndex = callLog.calls.indexOf('save');
      const publishIndex = callLog.calls.indexOf('publish');
      expect(saveIndex).toBeGreaterThanOrEqual(0);
      expect(publishIndex).toBeGreaterThan(saveIndex);
    });

    it('reads the creation instant from ClockPort, never from `new Date()` (ADR-009)', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);

      await useCase.execute(VALID_INPUT, contextFor(actor));

      expect(incidentRepository.saved[0].loggedAtEpochMs).toBe(
        CLOCK.now().getTime(),
      );
      expect(callLog.calls).toContain('clock.now');
    });
  });

  describe('AC2 — a reporter identifier supplied by the caller is discarded', () => {
    it('ignores any reporterId-shaped field the edge attaches to the input and uses the session actor instead', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);
      const attackerSuppliedReporterId = Identity.fromString(
        '0192f3a4-5b6c-7d8e-8f90-123456789abf',
      );
      // `LogIncidentInput` has no `reporterId` field (Trap 5) — this models an
      // edge caller that attaches one anyway (a stale client, a crafted
      // payload `class-validator` did not strip) and proves it never reaches
      // the aggregate.
      const inputWithForeignReporterId = {
        ...VALID_INPUT,
        reporterId: attackerSuppliedReporterId.value,
      } as LogIncidentInput;

      const result = await useCase.execute(
        inputWithForeignReporterId,
        contextFor(actor),
      );

      expect(
        incidentRepository.saved[0].reporterId.equals(ACTOR_IDENTITY),
      ).toBe(true);
      expect(
        incidentRepository.saved[0].reporterId.equals(
          attackerSuppliedReporterId,
        ),
      ).toBe(false);
      expect(result.id.equals(ALLOCATED_IDENTITY)).toBe(true);
    });
  });

  describe('Authorization — deny-by-default', () => {
    it('throws IncidentLogAuthorizationError and calls neither the repository nor the publisher when denied', async () => {
      const deniedActor = new StubActor(ACTOR_IDENTITY, false);

      await expect(
        useCase.execute(VALID_INPUT, contextFor(deniedActor)),
      ).rejects.toBeInstanceOf(IncidentLogAuthorizationError);

      expect(callLog.calls).toEqual([]);
      expect(incidentRepository.saved).toHaveLength(0);
      expect(eventPublisher.published).toHaveLength(0);
    });

    it('names the attempted operation on the thrown error', async () => {
      const deniedActor = new StubActor(ACTOR_IDENTITY, false);

      await expect(
        useCase.execute(VALID_INPUT, contextFor(deniedActor)),
      ).rejects.toMatchObject({ operation: 'LogIncident' });
    });
  });

  describe('Call order (Trap 5)', () => {
    it('authorizes, then allocates identity and reference, then saves, then attaches SLA, then publishes', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);

      await useCase.execute(VALID_INPUT, contextFor(actor));

      expect(callLog.calls).toEqual([
        'nextIdentity',
        'nextReference',
        'clock.now',
        'save',
        'attachFor',
        'publish',
      ]);
    });
  });

  describe('AC4 — runs against stubbed ports only', () => {
    it('never imports or touches HTTP or a database — every port here is an in-memory stub', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);

      await expect(
        useCase.execute(VALID_INPUT, contextFor(actor)),
      ).resolves.toBeDefined();
    });
  });

  describe('Failure isolation between save() and publish()', () => {
    it('never calls the publisher, and never attaches SLA, when save() fails', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);
      incidentRepository.saveError = new Error('constraint violation');

      await expect(
        useCase.execute(VALID_INPUT, contextFor(actor)),
      ).rejects.toThrow('constraint violation');

      expect(callLog.calls).toEqual([
        'nextIdentity',
        'nextReference',
        'clock.now',
        'save',
      ]);
      expect(eventPublisher.published).toHaveLength(0);
      expect(slaPolicy.attachedTo).toHaveLength(0);
    });

    it('propagates an SlaPolicyPort failure and never publishes, even though the Incident is already persisted', async () => {
      const actor = new StubActor(ACTOR_IDENTITY, true);
      slaPolicy.attachError = new Error('sla adapter unavailable');

      await expect(
        useCase.execute(VALID_INPUT, contextFor(actor)),
      ).rejects.toThrow('sla adapter unavailable');

      expect(incidentRepository.saved).toHaveLength(1);
      expect(eventPublisher.published).toHaveLength(0);
    });
  });
});
