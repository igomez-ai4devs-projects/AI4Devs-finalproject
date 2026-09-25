import { Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import {
  DomainEvent,
  EVENT_PUBLISHER,
  Identity,
  type EventPublisherPort,
} from '@sport-itsm/shared-domain';
import { EVENT_SUBSCRIPTION_REGISTRY } from '../event-dispatch/event-dispatch.tokens';
import type { EventSubscriptionRegistry } from '../event-dispatch/event-subscription-registry';

/**
 * Test-only HTTP surface for `T-C10-73`'s acceptance scenario. It carries no
 * product behavior: no bounded context, no real event, no persistence.
 *
 * Its reason to exist over HTTP rather than only in Jest: the ticket's Scope
 * asks for an API-E2E scenario proving the mechanism end to end, through the
 * real, DI-wired `InProcessEventDispatcher` — the same dispatcher a real use
 * case will inject once one exists. `in-process-event-dispatcher.spec.ts`
 * already proves the dispatch mechanism itself in isolation; this only
 * proves the wiring reachable from a live process.
 *
 * `TestEventDispatchModule` (the only place that imports this controller) is
 * added to `AppModule`'s import list only when `NODE_ENV=test`
 * (`../app/app.module.ts`), so this route does not exist in `development` or
 * `production` — an unmatched route answers `404`, exactly like every route
 * before `T-C10-28` (`apps/api-e2e/src/features/harness-smoke.feature`).
 * Adding this controller is not "a route to make the smoke feature greener"
 * (forbidden by `T-C10-06`): it is a dedicated, environment-gated scenario for
 * a dedicated mechanism, not a change to that smoke test or its assertions.
 */
const HARNESS_ACTOR = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-000000000000',
);
const HARNESS_TEST_EVENT_NAME = 'TestEvent';

interface DispatchWithFailingSubscriberResponse {
  readonly correlationId: string;
  readonly healthySubscriberReceivedEvent: boolean;
}

@Controller('test-harness/events')
export class TestEventDispatchController implements OnModuleInit {
  private healthySubscriberReceiptCount = 0;

  constructor(
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisherPort,
    @Inject(EVENT_SUBSCRIPTION_REGISTRY)
    private readonly subscriptions: EventSubscriptionRegistry,
  ) {}

  /**
   * Registers the two generic subscribers this scenario needs exactly once,
   * at module boot — never per request, which would pile up a growing set of
   * subscribers on every call.
   */
  onModuleInit(): void {
    this.subscriptions.subscribe(HARNESS_TEST_EVENT_NAME, () => {
      throw new Error('deliberate failure from the harness test subscriber');
    });
    this.subscriptions.subscribe(HARNESS_TEST_EVENT_NAME, () => {
      this.healthySubscriberReceiptCount += 1;
    });
  }

  @Post('dispatch-with-failing-subscriber')
  dispatchWithFailingSubscriber(): DispatchWithFailingSubscriberResponse {
    const correlationId = `test-harness-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const receiptCountBefore = this.healthySubscriberReceiptCount;

    this.publisher.publish([
      DomainEvent.record({
        name: HARNESS_TEST_EVENT_NAME,
        occurredAt: new Date(),
        actor: HARNESS_ACTOR,
        correlationId,
        payload: {},
      }),
    ]);

    return {
      correlationId,
      healthySubscriberReceivedEvent:
        this.healthySubscriberReceiptCount > receiptCountBefore,
    };
  }
}
