import { Logger } from '@nestjs/common';
import { DomainEvent, Identity } from '@sport-itsm/shared-domain';
import { InProcessEventDispatcher } from './in-process-event-dispatcher';

const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc');
const EVENT_NAME = 'TestEvent';
const OTHER_EVENT_NAME = 'OtherTestEvent';

function buildTestEvent(options?: {
  name?: string;
  correlationId?: string;
  payload?: Record<string, unknown>;
}): DomainEvent<Record<string, unknown>> {
  return DomainEvent.record({
    name: options?.name ?? EVENT_NAME,
    occurredAt: new Date('2026-09-25T09:00:00.000Z'),
    actor: ACTOR,
    correlationId: options?.correlationId ?? 'test-correlation-id',
    payload: options?.payload ?? {},
  });
}

/** Waits for already-scheduled promise reactions to run, without asserting on timing. */
function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Models a use case's own commit-then-publish sequencing (ADR-008). There is
 * no transaction and no database here — those arrive with `T-C1-07` — this
 * is only the ordering contract `EventPublisherPort`'s own doc comment
 * assigns to the caller: commit first, `publish()` after, and never publish
 * at all when the operation rolls back. See this ticket's final report,
 * finding (a).
 */
function runFakeUseCase(
  dispatcher: InProcessEventDispatcher,
  events: DomainEvent<object>[],
  options: { commits: boolean; onCommit?: () => void },
): 'committed' | 'rolled-back' {
  if (!options.commits) {
    return 'rolled-back';
  }
  options.onCommit?.();
  dispatcher.publish(events);
  return 'committed';
}

describe('InProcessEventDispatcher', () => {
  let dispatcher: InProcessEventDispatcher;

  beforeEach(() => {
    dispatcher = new InProcessEventDispatcher();
  });

  describe('AC1 — dispatched exactly once, strictly after commit', () => {
    it('invokes a registered subscriber exactly once for a published event', () => {
      const subscriber = jest.fn();
      dispatcher.subscribe(EVENT_NAME, subscriber);

      dispatcher.publish([buildTestEvent()]);

      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it('dispatches only after the use case has committed, in that order', () => {
      const callOrder: string[] = [];
      dispatcher.subscribe(EVENT_NAME, () => {
        callOrder.push('dispatched');
      });

      const outcome = runFakeUseCase(dispatcher, [buildTestEvent()], {
        commits: true,
        onCommit: () => callOrder.push('committed'),
      });

      expect(outcome).toBe('committed');
      expect(callOrder).toEqual(['committed', 'dispatched']);
    });

    it('dispatches only to subscribers registered for the matching event name', () => {
      const matching = jest.fn();
      const other = jest.fn();
      dispatcher.subscribe(EVENT_NAME, matching);
      dispatcher.subscribe(OTHER_EVENT_NAME, other);

      dispatcher.publish([buildTestEvent({ name: EVENT_NAME })]);

      expect(matching).toHaveBeenCalledTimes(1);
      expect(other).not.toHaveBeenCalled();
    });
  });

  describe('AC3 — a rolled-back operation publishes nothing', () => {
    it('never reaches any subscriber when the caller does not commit', () => {
      const subscriber = jest.fn();
      dispatcher.subscribe(EVENT_NAME, subscriber);

      const outcome = runFakeUseCase(dispatcher, [buildTestEvent()], {
        commits: false,
      });

      expect(outcome).toBe('rolled-back');
      expect(subscriber).not.toHaveBeenCalled();
    });
  });

  describe('AC2 — a failing subscriber is isolated', () => {
    it('does not throw into the caller when a subscriber throws synchronously', () => {
      dispatcher.subscribe(EVENT_NAME, () => {
        throw new Error('synchronous failure');
      });

      expect(() => dispatcher.publish([buildTestEvent()])).not.toThrow();
    });

    it('still delivers the event to every other subscriber when one throws synchronously', () => {
      const callOrder: string[] = [];
      dispatcher.subscribe(EVENT_NAME, () => {
        callOrder.push('first');
      });
      dispatcher.subscribe(EVENT_NAME, () => {
        callOrder.push('failing');
        throw new Error('synchronous failure');
      });
      dispatcher.subscribe(EVENT_NAME, () => {
        callOrder.push('third');
      });

      dispatcher.publish([buildTestEvent()]);

      expect(callOrder).toEqual(['first', 'failing', 'third']);
    });

    it('does not throw into the caller when a subscriber returns a rejected promise', () => {
      dispatcher.subscribe(EVENT_NAME, () =>
        Promise.reject(new Error('async failure')),
      );

      expect(() => dispatcher.publish([buildTestEvent()])).not.toThrow();
    });

    it('still delivers the event to every other subscriber when one rejects asynchronously', async () => {
      const healthy = jest.fn();
      dispatcher.subscribe(EVENT_NAME, () =>
        Promise.reject(new Error('async failure')),
      );
      dispatcher.subscribe(EVENT_NAME, healthy);

      dispatcher.publish([buildTestEvent()]);
      await flushMicrotasks();

      expect(healthy).toHaveBeenCalledTimes(1);
    });

    it('never raises an unhandled promise rejection for a subscriber that rejects', async () => {
      const onUnhandledRejection = jest.fn();
      process.on('unhandledRejection', onUnhandledRejection);

      try {
        dispatcher.subscribe(EVENT_NAME, () =>
          Promise.reject(new Error('async failure')),
        );

        dispatcher.publish([buildTestEvent()]);
        await flushMicrotasks();
        await flushMicrotasks();

        expect(onUnhandledRejection).not.toHaveBeenCalled();
      } finally {
        process.off('unhandledRejection', onUnhandledRejection);
      }
    });

    it('logs a synchronous failure with the event name and correlation identifier, never the payload', () => {
      const errorSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => undefined);

      dispatcher.subscribe(EVENT_NAME, () => {
        throw new Error('synchronous failure');
      });
      dispatcher.publish([
        buildTestEvent({
          correlationId: 'corr-sync-001',
          payload: { doNotLogMe: 'sensitive-value-001' },
        }),
      ]);

      expect(errorSpy).toHaveBeenCalledTimes(1);
      const [loggedMessage] = errorSpy.mock.calls[0];
      expect(String(loggedMessage)).toContain('corr-sync-001');
      expect(String(loggedMessage)).toContain(EVENT_NAME);
      expect(String(loggedMessage)).not.toContain('sensitive-value-001');

      errorSpy.mockRestore();
    });

    it('logs an asynchronous rejection with the event name and correlation identifier, never the payload', async () => {
      const errorSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation(() => undefined);

      dispatcher.subscribe(EVENT_NAME, () =>
        Promise.reject(new Error('async failure')),
      );
      dispatcher.publish([
        buildTestEvent({
          correlationId: 'corr-async-002',
          payload: { doNotLogMe: 'sensitive-value-002' },
        }),
      ]);
      await flushMicrotasks();

      expect(errorSpy).toHaveBeenCalledTimes(1);
      const [loggedMessage] = errorSpy.mock.calls[0];
      expect(String(loggedMessage)).toContain('corr-async-002');
      expect(String(loggedMessage)).toContain(EVENT_NAME);
      expect(String(loggedMessage)).not.toContain('sensitive-value-002');

      errorSpy.mockRestore();
    });
  });

  describe('no retry (ADR-008 names it for C18, not for this mechanism)', () => {
    it('calls a failing subscriber exactly once', () => {
      const failing = jest.fn(() => {
        throw new Error('synchronous failure');
      });
      dispatcher.subscribe(EVENT_NAME, failing);

      dispatcher.publish([buildTestEvent()]);

      expect(failing).toHaveBeenCalledTimes(1);
    });
  });
});
