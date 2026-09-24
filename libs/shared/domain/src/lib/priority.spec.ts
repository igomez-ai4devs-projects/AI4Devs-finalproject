import { DomainError } from './domain-error';
import { Priority, PRIORITY_CODES, InvalidPriorityError } from './priority.vo';

describe('Priority', () => {
  it.each([...PRIORITY_CODES])('accepts %s', (code) => {
    expect(Priority.fromCode(code).code).toBe(code);
  });

  it.each([
    ['a level below the set', 'P0'],
    ['a level above the set', 'P5'],
    ['a lowercase code', 'p1'],
    ['a bare number', '1'],
    ['the empty string', ''],
  ])('rejects %s', (_case, code) => {
    expect(() => Priority.fromCode(code)).toThrow(InvalidPriorityError);
  });

  it('throws an error distinguishable by type and carrying the rejected value', () => {
    expect.assertions(3);
    try {
      Priority.fromCode('P9');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidPriorityError);
      expect(error).toBeInstanceOf(DomainError);
      expect((error as InvalidPriorityError).offendingValue).toBe('P9');
    }
  });

  it('compares by code', () => {
    expect(Priority.fromCode('P1').equals(Priority.fromCode('P1'))).toBe(true);
    expect(Priority.fromCode('P1').equals(Priority.fromCode('P2'))).toBe(false);
  });

  it('is immutable', () => {
    const priority = Priority.fromCode('P2');
    expect(() => {
      (priority as { code: string }).code = 'P1';
    }).toThrow(TypeError);
    expect(priority.code).toBe('P2');
  });
});
