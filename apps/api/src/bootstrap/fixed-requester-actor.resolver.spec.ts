import { IncidentActorResolver } from '../app/incident/incident-actor-resolver';
import { FixedRequesterActorResolver } from './fixed-requester-actor.resolver';
import { BOOTSTRAP_REQUESTER_ID } from './bootstrap-identities';

describe('FixedRequesterActorResolver (T-C10-74)', () => {
  it('resolves the same static IncidentActor regardless of the request context it receives', async () => {
    // Typed through the port, not the concrete class, so this call is
    // checked against `IncidentActorResolver.resolveActor`'s own (optional)
    // parameter — the shape `T-C10-39`'s real resolver and `T-C1-08`'s
    // controller will actually call through.
    const resolver: IncidentActorResolver = new FixedRequesterActorResolver();

    const actor = await resolver.resolveActor({ some: 'request-shaped value' });

    expect(actor.identity.equals(BOOTSTRAP_REQUESTER_ID)).toBe(true);
    expect(actor.canLogIncidentAsRequester()).toBe(true);
  });

  it('ignores having no request context at all', async () => {
    const resolver = new FixedRequesterActorResolver();

    const actor = await resolver.resolveActor();

    expect(actor.identity.equals(BOOTSTRAP_REQUESTER_ID)).toBe(true);
  });
});
