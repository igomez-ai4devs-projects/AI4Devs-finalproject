import { DomainError, describeValue } from './domain-error';

/**
 * Canonical UUID shape, restricted to **version 7** and to the RFC 4122
 * variant. Identities are issued by the repository port (`nextIdentity()`,
 * `DATA-MODEL.md` §3.1) precisely so an aggregate is fully valid before any
 * I/O; this type is the guard that a value coming back into the domain really
 * is one of those, not a v4 that would silently break the time-ordering the
 * schema depends on (§3.1.1).
 */
const UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class InvalidIdentityError extends DomainError {
  constructor(offendingValue: unknown) {
    super(
      `Identity must be a canonical UUID v7; received ${describeValue(offendingValue)}`,
      offendingValue,
    );
  }
}

/** The identifier of any aggregate in the platform. Immutable. */
export class Identity {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  /**
   * @throws {InvalidIdentityError} when `value` is not a canonical UUID v7.
   */
  static fromString(value: string): Identity {
    if (!UUID_V7.test(value)) {
      throw new InvalidIdentityError(value);
    }
    // UUIDs are case-insensitive; storing the canonical lowercase form keeps
    // equality and persistence comparisons honest.
    return new Identity(value.toLowerCase());
  }

  equals(other: Identity): boolean {
    return this.value === other.value;
  }
}
