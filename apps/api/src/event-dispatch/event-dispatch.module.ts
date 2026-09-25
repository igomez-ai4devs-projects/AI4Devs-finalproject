import { Global, Module } from '@nestjs/common';
import {
  EVENT_PUBLISHER,
  EVENT_SUBSCRIPTION_REGISTRY,
} from './event-dispatch.tokens';
import { InProcessEventDispatcher } from './in-process-event-dispatcher';

/**
 * Binds `EventPublisherPort` to the single in-process dispatcher (ADR-008).
 *
 * `@Global()` mirrors `ConfigModule.forRoot({ isGlobal: true }, ...)` in
 * `app.module.ts`: every future context module needs `EVENT_PUBLISHER` to
 * publish after its own commit, and at most a one-time subscription step
 * against `EVENT_SUBSCRIPTION_REGISTRY` — making every context re-import
 * this module for two tokens it never varies would be ceremony, not
 * isolation.
 */
@Global()
@Module({
  providers: [
    InProcessEventDispatcher,
    { provide: EVENT_PUBLISHER, useExisting: InProcessEventDispatcher },
    {
      provide: EVENT_SUBSCRIPTION_REGISTRY,
      useExisting: InProcessEventDispatcher,
    },
  ],
  exports: [EVENT_PUBLISHER, EVENT_SUBSCRIPTION_REGISTRY],
})
export class EventDispatchModule {}
