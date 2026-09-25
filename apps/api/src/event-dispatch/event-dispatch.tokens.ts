/**
 * Injection token for `EventSubscriptionRegistry`, the subscribe-side seam of
 * the in-process dispatcher (`InProcessEventDispatcher`).
 *
 * The interface is erased at runtime, so NestJS needs a value to key the
 * binding on; a `Symbol` avoids the collisions a plain string token risks.
 *
 * Unlike `EVENT_PUBLISHER` — which lives beside `EventPublisherPort` in
 * `@sport-itsm/shared-domain`, per `ARCHITECTURE.md` §6.3, because use cases in
 * `type:application` libraries inject it — this token stays here: subscribers
 * are registered by the composition root only, so nothing outside `apps/api`
 * ever needs it.
 */
export const EVENT_SUBSCRIPTION_REGISTRY = Symbol(
  'EVENT_SUBSCRIPTION_REGISTRY',
);
