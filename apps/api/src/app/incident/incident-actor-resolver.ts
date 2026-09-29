import { IncidentActor } from '@sport-itsm/incident-application';

/**
 * How `apps/api` hands an `IncidentActor` to whatever inbound adapter needs
 * one — today, only the disposable fixed provider `T-C10-74` binds; from
 * `T-C10-39` onward, an adapter that assembles the real, per-request `Actor`
 * (`ARCHITECTURE.md` §9 — "Authorization … enforced in `type:application` use
 * cases", resolved server-side, never trusted from token claims) and narrows
 * it into this context's own `IncidentActor` view (`incident-actor.ts`'s own
 * doc comment already names this exact adaptation as the composition root's
 * job).
 *
 * This port — the interface and its token — is **not** part of what
 * `T-C10-74` disposes of. Its own AC5 names one class for `T-C10-39` to
 * delete outright: the fixed implementation
 * (`../../bootstrap/fixed-requester-actor.resolver.ts`). This file is the
 * seam that survives that deletion — `T-C10-39` rebinds
 * `INCIDENT_ACTOR_RESOLVER` to its real adapter in `IncidentModule`, one
 * line, without touching this declaration or `T-C1-08`'s controller, which
 * depends on the token and never on the disposable class.
 *
 * `resolveActor` takes the inbound request context so the real resolver
 * (`T-C10-39`) can read whatever it needs from the request — the same
 * request-scoped, resolve-once-per-request shape that ticket's own Scope
 * describes — without this port naming a concrete request type today.
 * Nothing in this ticket's build has an HTTP layer yet (`T-C1-08` is the one
 * that will), and no `express` (or any other HTTP framework) type is a
 * resolvable dependency of `apps/api` today, so the parameter is typed
 * `unknown` rather than invented: a real request-shaped type would either be
 * a guess this ticket has no basis for, or a premature dependency the
 * composition root does not need yet (YAGNI). Optional, not required,
 * because this ticket's only implementation ignores it entirely and no
 * caller exists yet to supply one — `T-C10-39` is free to give the parameter
 * a concrete, required type when it introduces the shape it actually reads,
 * a signature change that ticket owns.
 *
 * Declared to return a `Promise` — not a bare `IncidentActor` — because the
 * real resolution (`T-C10-39`) loads role assignments and permission sets
 * from a repository, an inherently asynchronous read; deciding that now
 * means `T-C1-08`'s controller, once written, awaits this call from day one
 * and never has to change its call shape when the real resolver lands.
 */
export interface IncidentActorResolver {
  resolveActor(requestContext?: unknown): Promise<IncidentActor>;
}

/**
 * The injection token for `IncidentActorResolver` — same pattern as
 * `INCIDENT_REPOSITORY` beside `IncidentRepositoryPort`
 * (`libs/incident/domain/src/lib/incident-repository.port.ts`): a `Symbol`
 * names the dependency without importing any framework, and the type is
 * erased at runtime so NestJS needs a value to key the binding on. This
 * token lives in `apps/api`, not in a `libs/incident/*` library, because
 * `IncidentActorResolver` is a composition-root concern (§9's per-request
 * assembly happens in `apps/api`) — unlike `IncidentRepositoryPort`, no
 * `type:application` use case ever depends on this token; `LogIncidentContext.actor`
 * already carries the resolved `IncidentActor` in by the time the use case
 * runs (`log-incident.use-case.ts`).
 */
export const INCIDENT_ACTOR_RESOLVER = Symbol('IncidentActorResolver');
