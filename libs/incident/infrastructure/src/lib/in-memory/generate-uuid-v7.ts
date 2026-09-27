import { randomBytes } from 'node:crypto';

/**
 * A UUID v7 minted in-process, RFC 9562 §5.7, for `InMemoryIncidentRepository.nextIdentity()`
 * (`T-C10-77` Trap 4). `TypeOrmIncidentRepository.nextIdentity()` reads PostgreSQL 18's core
 * `uuidv7()` function instead (`DATA-MODEL.md` §3.1, §3.8) — this adapter has no database to ask,
 * so it builds the same 128-bit layout by hand, with **no new dependency**: `node:crypto`'s
 * `randomBytes` is a Node built-in.
 *
 * Layout (16 bytes, big-endian):
 * - bytes 0–5 (48 bits): `unix_ts_ms` — `Date.now()`, most significant byte first.
 * - byte 6 high nibble: the version, fixed `0111` (`0x7_`).
 * - byte 6 low nibble + byte 7 (12 bits): `rand_a`.
 * - byte 8 top 2 bits: the variant, fixed `10` (`0x8_`–`0xb_` on that nibble).
 * - byte 8 low 6 bits + bytes 9–15 (62 bits): `rand_b`.
 *
 * Kept **private to this folder** (not exported from `../../index.ts`, not moved to
 * `shared/util`): it reads the wall clock and system randomness, neither of which is a pure
 * function `shared/util` may hold (`T-C10-77` Trap 4).
 */
export function generateUuidV7(): string {
  const unixTimestampMs = BigInt(Date.now());
  // 10 random bytes cover both `rand_a` (12 bits) and `rand_b` (62 bits) in one read; the
  // version and variant bits below are OR-ed on top of the first byte of each field,
  // discarding exactly the bits RFC 9562 reserves.
  const randomOctets = randomBytes(10);

  const bytes = new Uint8Array(16);

  for (let byteIndex = 0; byteIndex < 6; byteIndex++) {
    const shift = BigInt(8 * (5 - byteIndex));
    bytes[byteIndex] = Number((unixTimestampMs >> shift) & 0xffn);
  }

  bytes[6] = 0x70 | (randomOctets[0] & 0x0f);
  bytes[7] = randomOctets[1];
  bytes[8] = 0x80 | (randomOctets[2] & 0x3f);
  for (let index = 0; index < 7; index++) {
    bytes[9 + index] = randomOctets[3 + index];
  }

  const hex = Buffer.from(bytes).toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}
