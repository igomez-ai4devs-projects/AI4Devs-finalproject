import { SystemClock } from './system-clock';

describe('SystemClock (T-C1-08 Trap 5)', () => {
  it('reads the platform clock — the one legitimate `new Date()` call site (ADR-009)', () => {
    const before = Date.now();

    const now = new SystemClock().now();

    const after = Date.now();
    expect(now).toBeInstanceOf(Date);
    expect(now.getTime()).toBeGreaterThanOrEqual(before);
    expect(now.getTime()).toBeLessThanOrEqual(after);
  });

  it('returns a fresh instant on every call, never a cached one', async () => {
    const clock = new SystemClock();

    const first = clock.now();
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = clock.now();

    expect(second.getTime()).toBeGreaterThan(first.getTime());
  });
});
