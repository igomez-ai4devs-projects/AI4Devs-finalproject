import { Identity } from '@sport-itsm/shared-domain';
import { generateUuidV7 } from './generate-uuid-v7';

describe('generateUuidV7()', () => {
  it('produces a value Identity.fromString() accepts (canonical UUID v7)', () => {
    const value = generateUuidV7();

    expect(() => Identity.fromString(value)).not.toThrow();
  });

  it('renders lowercase, in the 8-4-4-4-12 shape', () => {
    const value = generateUuidV7();

    expect(value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('produces N distinct values across N calls', () => {
    const values = Array.from({ length: 500 }, () => generateUuidV7());

    expect(new Set(values).size).toBe(values.length);
  });

  it('encodes the version nibble 0111 (character "7") at position 12', () => {
    const value = generateUuidV7();

    expect(value.charAt(14)).toBe('7');
  });

  it('encodes the RFC 4122 variant ("8", "9", "a" or "b") right after the second dash group', () => {
    const value = generateUuidV7();

    expect(value.charAt(19)).toMatch(/[89ab]/);
  });

  it("encodes the current instant's Date.now() in its first 12 hex characters", () => {
    jest.useFakeTimers();
    try {
      const fixedInstant = new Date('2026-09-27T12:00:00.000Z');
      jest.setSystemTime(fixedInstant);

      const value = generateUuidV7();

      const first12Hex = value.replace(/-/g, '').slice(0, 12);
      const encodedEpochMs = Number(BigInt(`0x${first12Hex}`));
      expect(encodedEpochMs).toBe(fixedInstant.getTime());
    } finally {
      jest.useRealTimers();
    }
  });

  it('falls within [before, after] wall-clock reads taken around the call, without fixing the clock', () => {
    const before = Date.now();
    const value = generateUuidV7();
    const after = Date.now();

    const first12Hex = value.replace(/-/g, '').slice(0, 12);
    const encodedEpochMs = Number(BigInt(`0x${first12Hex}`));

    expect(encodedEpochMs).toBeGreaterThanOrEqual(before);
    expect(encodedEpochMs).toBeLessThanOrEqual(after);
  });
});
