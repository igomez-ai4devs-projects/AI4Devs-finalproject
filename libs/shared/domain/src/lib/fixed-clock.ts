import { ClockPort } from './clock.port';

/**
 * A `ClockPort` frozen at one instant, for tests that need time to hold still.
 *
 * It is exported from this library's public API on purpose: every context's
 * unit tests need it, and a test double that lives in one context's test folder
 * is a double the next context copies. The cost is that it ships as production
 * surface, which is the trade-off the ticket accepts.
 *
 * It does not advance. A test that needs two instants constructs two clocks,
 * which keeps this type honest about what it is — a constant, not a simulation.
 * Nothing needs elapsed time yet; when something does, that ticket can extend
 * this deliberately rather than inherit a mutable clock nobody asked for.
 */
export class FixedClock implements ClockPort {
  private constructor(private readonly instantEpochMs: number) {
    Object.freeze(this);
  }

  static at(instant: Date): FixedClock {
    return new FixedClock(instant.getTime());
  }

  /**
   * A fresh `Date` per call: handing out one stored instance would let a caller
   * move the clock with `setTime()`. This is the single place in the library
   * where a date is constructed, and it is the test double the acceptance
   * criterion allows.
   */
  now(): Date {
    return new Date(this.instantEpochMs);
  }
}
