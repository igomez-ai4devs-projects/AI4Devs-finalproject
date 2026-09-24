import { DateTimeRange, InvalidDateTimeRangeError } from './date-time-range.vo';
import { DomainError } from './domain-error';

const START = new Date('2026-09-23T09:00:00.000Z');
const END = new Date('2026-09-23T17:00:00.000Z');

describe('DateTimeRange', () => {
  it('accepts an ordered pair and keeps both bounds as epoch milliseconds', () => {
    const range = DateTimeRange.between(START, END);

    expect(range.startsAtEpochMs).toBe(START.getTime());
    expect(range.endsAtEpochMs).toBe(END.getTime());
  });

  it('is half-open: it contains its start and excludes its end', () => {
    const range = DateTimeRange.between(START, END);

    expect(range.contains(START)).toBe(true);
    expect(range.contains(new Date('2026-09-23T12:00:00.000Z'))).toBe(true);
    expect(range.contains(END)).toBe(false);
    expect(range.contains(new Date('2026-09-23T08:59:59.999Z'))).toBe(false);
  });

  it('rejects an empty range, because a zero-length window is a mistake', () => {
    expect(() => DateTimeRange.between(START, START)).toThrow(
      InvalidDateTimeRangeError,
    );
  });

  it('rejects an inverted range', () => {
    expect(() => DateTimeRange.between(END, START)).toThrow(
      InvalidDateTimeRangeError,
    );
  });

  it.each([
    ['an invalid start', new Date('not a date'), END],
    ['an invalid end', START, new Date('not a date')],
  ])('rejects %s', (_case, start, end) => {
    expect(() => DateTimeRange.between(start, end)).toThrow(
      InvalidDateTimeRangeError,
    );
  });

  it('throws an error distinguishable by type', () => {
    expect.assertions(2);
    try {
      DateTimeRange.between(END, START);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidDateTimeRangeError);
      expect(error).toBeInstanceOf(DomainError);
    }
  });

  it('compares by both bounds', () => {
    const range = DateTimeRange.between(START, END);

    expect(range.equals(DateTimeRange.between(START, END))).toBe(true);
    expect(
      range.equals(
        DateTimeRange.between(START, new Date('2026-09-23T18:00:00.000Z')),
      ),
    ).toBe(false);
  });

  it('is immutable, and a mutated input Date cannot reach inside it', () => {
    const start = new Date(START.getTime());
    const range = DateTimeRange.between(start, END);

    start.setTime(0);

    expect(range.startsAtEpochMs).toBe(START.getTime());
    expect(() => {
      (range as { startsAtEpochMs: number }).startsAtEpochMs = 0;
    }).toThrow(TypeError);
  });
  describe('open-ended ranges', () => {
    it('is open-ended when built without an upper bound', () => {
      const range = DateTimeRange.openEndedFrom(START);

      expect(range.isOpenEnded).toBe(true);
      expect(range.endsAtEpochMs).toBeNull();
    });

    it('contains every instant at or after its start', () => {
      const range = DateTimeRange.openEndedFrom(START);

      expect(range.contains(START)).toBe(true);
      expect(range.contains(new Date('2099-01-01T00:00:00.000Z'))).toBe(true);
      expect(range.contains(new Date('2026-09-23T08:59:59.999Z'))).toBe(false);
    });

    it('rejects an invalid start', () => {
      expect(() => DateTimeRange.openEndedFrom(new Date('not a date'))).toThrow(
        InvalidDateTimeRangeError,
      );
    });

    it('closes into a bounded range without mutating the original', () => {
      const open = DateTimeRange.openEndedFrom(START);
      const closed = open.closedAt(END);

      expect(closed.equals(DateTimeRange.between(START, END))).toBe(true);
      expect(open.isOpenEnded).toBe(true);
      expect(open.endsAtEpochMs).toBeNull();
    });

    it('rejects closing at or before its start', () => {
      const open = DateTimeRange.openEndedFrom(END);

      expect(() => open.closedAt(END)).toThrow(InvalidDateTimeRangeError);
      expect(() => open.closedAt(START)).toThrow(InvalidDateTimeRangeError);
    });

    it('refuses to close an already closed range, because the end instant is a recorded fact', () => {
      const closed = DateTimeRange.between(START, END);

      expect(() =>
        closed.closedAt(new Date('2026-09-23T18:00:00.000Z')),
      ).toThrow(InvalidDateTimeRangeError);
    });

    it('is unequal to a bounded range starting at the same instant', () => {
      expect(
        DateTimeRange.openEndedFrom(START).equals(
          DateTimeRange.between(START, END),
        ),
      ).toBe(false);
    });

    it('is equal to another open-ended range with the same start', () => {
      expect(
        DateTimeRange.openEndedFrom(START).equals(
          DateTimeRange.openEndedFrom(START),
        ),
      ).toBe(true);
    });
  });
});
