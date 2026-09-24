import { DomainError, describeValue } from './domain-error';

export class InvalidDateTimeRangeError extends DomainError {
  constructor(message: string, offendingValue: unknown) {
    super(message, offendingValue);
  }
}

/**
 * A half-open interval of UTC instants, `[startsAt, endsAt)`, with an optional
 * upper bound (`ARCHITECTURE.md` §4.2, "Shared-kernel temporal primitives").
 *
 * Four decisions worth stating, because the type is unusable without knowing
 * them:
 *
 * 1. **Half-open.** The end instant is *excluded*, so adjacent ranges tile
 *    without overlapping and without the 23:59:59.999 fudge that closed
 *    intervals force on every caller.
 * 2. **Open-ended is a first-class state.** An absent upper bound means "still
 *    in force", the shape `valid_to IS NULL` carries in every context that
 *    stores a validity period. Modelling it as a far-future sentinel instant
 *    would make `contains` lie at the boundary and leak a magic value.
 * 3. **Empty ranges are rejected**, not represented: `startsAt` must be
 *    strictly before `endsAt`. This mirrors the three constraints the schema
 *    already declares — `ck_iam_competition_scope_validity`,
 *    `ck_apr_delegation_period` and `ck_sla_policy_effective_range`, all `>`,
 *    never `>=`. Pairs whose constraint deliberately tolerates equality, such
 *    as a paused SLA resumed in the same instant, are *not* this type.
 * 4. **It holds no clock.** Nothing here reads the current time — time reaches
 *    the domain through `ClockPort`, which is a separate ticket. Instants are
 *    kept as epoch milliseconds so the value is genuinely immutable; a stored
 *    `Date` would stay mutable through `setTime()` however frozen the object
 *    around it is.
 */
export class DateTimeRange {
  private constructor(
    readonly startsAtEpochMs: number,
    readonly endsAtEpochMs: number | null,
  ) {
    Object.freeze(this);
  }

  /**
   * A range bounded at both ends.
   *
   * @throws {InvalidDateTimeRangeError} when either bound is an invalid date,
   * or when the range would be empty or inverted.
   */
  static between(startsAt: Date, endsAt: Date): DateTimeRange {
    const start = DateTimeRange.readInstant(startsAt, 'start');
    const end = DateTimeRange.readInstant(endsAt, 'end');
    DateTimeRange.assertOrdered(start, end);

    return new DateTimeRange(start, end);
  }

  /**
   * A range with no upper bound yet — the `valid_to IS NULL` shape.
   *
   * @throws {InvalidDateTimeRangeError} when `startsAt` is an invalid date.
   */
  static openEndedFrom(startsAt: Date): DateTimeRange {
    return new DateTimeRange(
      DateTimeRange.readInstant(startsAt, 'start'),
      null,
    );
  }

  get isOpenEnded(): boolean {
    return this.endsAtEpochMs === null;
  }

  /**
   * Closes an open-ended range — revoking a grant, superseding a policy
   * version. Returns a new value; the receiver is unchanged.
   *
   * @throws {InvalidDateTimeRangeError} when the range is already closed, or
   * when `endsAt` would not be strictly after the start. Re-closing is
   * rejected rather than silently overwriting: the instant a validity period
   * ended is a recorded fact, not a mutable field.
   */
  closedAt(endsAt: Date): DateTimeRange {
    if (!this.isOpenEnded) {
      throw new InvalidDateTimeRangeError(
        `DateTimeRange is already closed at ${this.endsAtEpochMs}; a closed range cannot be closed again`,
        this.endsAtEpochMs,
      );
    }

    const end = DateTimeRange.readInstant(endsAt, 'end');
    DateTimeRange.assertOrdered(this.startsAtEpochMs, end);

    return new DateTimeRange(this.startsAtEpochMs, end);
  }

  /** True when `instant` falls in `[startsAt, endsAt)`, or at or after the start of an open-ended range. */
  contains(instant: Date): boolean {
    const value = instant.getTime();

    return (
      value >= this.startsAtEpochMs &&
      (this.endsAtEpochMs === null || value < this.endsAtEpochMs)
    );
  }

  equals(other: DateTimeRange): boolean {
    return (
      this.startsAtEpochMs === other.startsAtEpochMs &&
      this.endsAtEpochMs === other.endsAtEpochMs
    );
  }

  private static readInstant(value: Date, bound: 'start' | 'end'): number {
    const instant = value.getTime();

    if (Number.isNaN(instant)) {
      throw new InvalidDateTimeRangeError(
        `DateTimeRange ${bound} must be a valid date; received ${describeValue(value)}`,
        value,
      );
    }

    return instant;
  }

  private static assertOrdered(start: number, end: number): void {
    if (start >= end) {
      throw new InvalidDateTimeRangeError(
        `DateTimeRange start must be strictly before its end; received ${start} >= ${end}`,
        [start, end],
      );
    }
  }
}
