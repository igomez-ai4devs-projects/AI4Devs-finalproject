/**
 * Injection tokens for the in-process dispatcher (`InProcessEventDispatcher`).
 *
 * `EventPublisherPort` and `EventSubscriptionRegistry` are interfaces —
 * TypeScript erases both at runtime — so NestJS needs a value to key each
 * binding on; a `Symbol` avoids the string collisions a plain string token
 * risks.
 *
 * **Deviation from `ARCHITECTURE.md` §6.3**, recorded here rather than left
 * implicit: that section states the convention as "a matching Symbol
 * injection token exported from the domain lib" — i.e. alongside
 * `EventPublisherPort` in `libs/shared/domain`. This ticket (`T-C10-73`) is
 * scoped to `apps/api` only and must not touch `libs/**`, so both tokens are
 * declared here instead, off-convention. The consequence lands on whichever
 * ticket first writes a `libs/<context>/application` use case that needs to
 * `@Inject` `EVENT_PUBLISHER`: a `type:application` library cannot import
 * from `apps/api` (`type:app` appears in no row of the module-boundary
 * matrix — ARCHITECTURE.md §5.3 — so nothing may depend on it, and `apps/api`
 * has no `importPath` for a lib to resolve anyway). That ticket will need to
 * either move this token into `libs/shared/domain` (extending `T-C10-09`) or
 * choose a different injection seam. See this ticket's final report for the
 * same finding, addressed to `T-C10-55` and `T-C1-07`.
 */
export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');

export const EVENT_SUBSCRIPTION_REGISTRY = Symbol(
  'EVENT_SUBSCRIPTION_REGISTRY',
);
