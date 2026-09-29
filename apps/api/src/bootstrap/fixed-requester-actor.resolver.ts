import { IncidentActor } from '@sport-itsm/incident-application';
import { IncidentActorResolver } from '../app/incident/incident-actor-resolver';
import { BOOTSTRAP_REQUESTER_ID } from './bootstrap-identities';

/**
 * Delivery slice 1's disposable `IncidentActorResolver` (`T-C10-74`). Slice 1
 * has no authentication whatsoever — not even a fixed-user sign-in — so
 * nothing resolves a real, per-request actor for `LogIncidentUseCase`
 * (`T-C1-07`) to authorize against. This class stands in: it always resolves
 * the same static `IncidentActor`, entitled to log an Incident naming itself
 * as reporter, and consults no Role/Permission table because none is seeded
 * in this slice.
 *
 * **Disposable — `T-C10-39` deletes this file outright, not adapt it.** The
 * day a real per-request resolver exists (`T-C10-39`, "`Actor` assembly with
 * per-request server-side permission resolution"), this class has nothing
 * left to contribute: it is not extended, not reused, not refactored into
 * the real resolver — it is removed, and `IncidentModule`'s
 * `INCIDENT_ACTOR_RESOLVER` binding below is repointed to the real adapter in
 * the same change. That is exactly two edits: delete this file, change one
 * `useClass` line in `../app/incident/incident.module.ts`. Nothing else in
 * the codebase may come to depend on this class existing — `T-C1-08`'s
 * controller (the only consumer this slice has) depends on
 * `INCIDENT_ACTOR_RESOLVER`, the token declared in
 * `../app/incident/incident-actor-resolver.ts`, never on this class by name.
 *
 * The `IncidentActor` value itself is a plain object literal, not a second
 * class: this ticket's Scope asks for **one** class in the composition root,
 * and `IncidentActor` (`libs/incident/application/src/lib/incident-actor.ts`)
 * is a structural interface — nothing requires a dedicated class to satisfy
 * it.
 */
export class FixedRequesterActorResolver implements IncidentActorResolver {
  private static readonly ACTOR: IncidentActor = Object.freeze({
    identity: BOOTSTRAP_REQUESTER_ID,
    canLogIncidentAsRequester: (): boolean => true,
  });

  /**
   * Declares no parameter, unlike {@link IncidentActorResolver.resolveActor}'s
   * own optional one: this implementation has no request-shaped value to
   * read, so accepting and ignoring one would be an unused parameter for no
   * benefit. The interface's parameter stays optional precisely so this
   * class — and any caller that has nothing to pass yet — remains a valid
   * implementer; `T-C10-39`'s real resolver is the one that will read it.
   */
  async resolveActor(): Promise<IncidentActor> {
    return FixedRequesterActorResolver.ACTOR;
  }
}
