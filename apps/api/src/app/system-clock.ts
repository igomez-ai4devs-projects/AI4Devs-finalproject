import { Injectable } from '@nestjs/common';
import { ClockPort } from '@sport-itsm/shared-domain';

/**
 * `apps/api`'s one production `ClockPort` adapter (`T-C1-08` Trap 5,
 * ADR-009). No domain or application code ever calls `new Date()` directly —
 * this class is the single legitimate call site, the composition root's own
 * answer to "what time is it" for every context that binds `CLOCK` to it.
 *
 * Deliberately trivial: it wraps the platform clock and nothing else. A
 * fake/fixed implementation for tests already exists in the kernel
 * (`FixedClock`, `@sport-itsm/shared-domain`) — this class has no test-only
 * sibling to keep in sync.
 */
@Injectable()
export class SystemClock implements ClockPort {
  now(): Date {
    return new Date();
  }
}
