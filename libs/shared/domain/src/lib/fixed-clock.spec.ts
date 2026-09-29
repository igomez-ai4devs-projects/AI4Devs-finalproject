import { FixedClock } from './fixed-clock';

const INSTANT = new Date('2026-09-24T10:30:00.000Z');

describe('FixedClock', () => {
  it('returns the instant it was fixed at', () => {
    expect(FixedClock.at(INSTANT).now().getTime()).toBe(INSTANT.getTime());
  });

  it('returns the same instant however many times it is read', () => {
    const clock = FixedClock.at(INSTANT);

    expect(clock.now().getTime()).toBe(clock.now().getTime());
  });

  it('hands out a fresh date, so a caller cannot move the clock', () => {
    const clock = FixedClock.at(INSTANT);
    const first = clock.now();

    first.setTime(0);

    expect(clock.now().getTime()).toBe(INSTANT.getTime());
  });

  it('is unaffected by a mutation of the date it was built from', () => {
    const source = new Date(INSTANT.getTime());
    const clock = FixedClock.at(source);

    source.setTime(0);

    expect(clock.now().getTime()).toBe(INSTANT.getTime());
  });
});
