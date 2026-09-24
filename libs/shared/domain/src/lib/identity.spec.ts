import { DomainError } from './domain-error';
import { Identity, InvalidIdentityError } from './identity';

const V7 = '0192f3a4-5b6c-7d8e-8f90-123456789abc';

describe('Identity', () => {
  it('accepts a canonical UUID v7', () => {
    expect(Identity.fromString(V7).value).toBe(V7);
  });

  it('normalises to lowercase so equality is not case-dependent', () => {
    expect(
      Identity.fromString(V7.toUpperCase()).equals(Identity.fromString(V7)),
    ).toBe(true);
  });

  it.each([
    ['a v4 UUID', '0192f3a4-5b6c-4d8e-8f90-123456789abc'],
    ['an invalid variant nibble', '0192f3a4-5b6c-7d8e-1f90-123456789abc'],
    ['a UUID without dashes', '0192f3a45b6c7d8e8f90123456789abc'],
    ['a truncated UUID', '0192f3a4-5b6c-7d8e-8f90'],
    ['the empty string', ''],
    ['whitespace around a valid value', ` ${V7} `],
  ])('rejects %s', (_case, value) => {
    expect(() => Identity.fromString(value)).toThrow(InvalidIdentityError);
  });

  it('throws an error distinguishable by type, not by message', () => {
    expect.assertions(3);
    try {
      Identity.fromString('not-a-uuid');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidIdentityError);
      expect(error).toBeInstanceOf(DomainError);
      expect((error as InvalidIdentityError).offendingValue).toBe('not-a-uuid');
    }
  });

  it('is equal to another identity with the same value and unequal otherwise', () => {
    const other = '0192f3a4-5b6c-7d8e-8f90-123456789abd';
    expect(Identity.fromString(V7).equals(Identity.fromString(V7))).toBe(true);
    expect(Identity.fromString(V7).equals(Identity.fromString(other))).toBe(
      false,
    );
  });

  it('is immutable', () => {
    const identity = Identity.fromString(V7);
    expect(() => {
      (identity as { value: string }).value = 'tampered';
    }).toThrow(TypeError);
    expect(identity.value).toBe(V7);
  });
});
