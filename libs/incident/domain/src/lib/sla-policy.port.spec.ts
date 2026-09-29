import { FixedClock, Identity } from '@sport-itsm/shared-domain';
import { SLA_POLICY, SlaPolicyPort } from './sla-policy.port';
import { SLA_POLICY as BARREL_SLA_POLICY } from '../index';
import { Incident } from './incident.aggregate';
import { OriginChannel } from './origin-channel.vo';
import { IncidentReferencePolicy } from './incident-reference.policy';

const REPORTER = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abd');
const ACTOR = Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abe');
const CLOCK = FixedClock.at(new Date('2026-09-24T10:30:00.000Z'));

const anIncident = (): Incident =>
  Incident.log({
    id: Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc'),
    reference: IncidentReferencePolicy.format(1),
    reporterId: REPORTER,
    originChannel: OriginChannel.fromCode('portal'),
    shortDescription: 'Cannot submit match roster',
    description: 'The roster submission form rejects a valid squad list.',
    actor: ACTOR,
    correlationId: 'req-3f8a10c2',
    occurredAt: CLOCK.now(),
  }).incident;

/** The port is an interface; this is the smallest thing that can satisfy it. */
class NoopSlaPolicy implements SlaPolicyPort {
  readonly attachedTo: Incident[] = [];

  async attachFor(incident: Incident): Promise<void> {
    this.attachedTo.push(incident);
  }
}

describe('SlaPolicyPort', () => {
  it('is satisfiable by an adapter that takes the logged Incident and returns nothing', async () => {
    const policy = new NoopSlaPolicy();
    const incident = anIncident();

    await expect(policy.attachFor(incident)).resolves.toBeUndefined();
    expect(policy.attachedTo).toEqual([incident]);
  });

  it('exports a Symbol injection token beside the port, reachable from the barrel', () => {
    expect(typeof SLA_POLICY).toBe('symbol');
    expect(SLA_POLICY).toBe(BARREL_SLA_POLICY);
  });
});
