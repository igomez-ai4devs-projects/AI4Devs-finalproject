import { isNonEmptyString } from './non-empty-string';

describe('isNonEmptyString', () => {
  it.each([
    ['a single character', 'a'],
    ['a padded value', '  Major Incident  '],
  ])('accepts %s', (_case, value) => {
    expect(isNonEmptyString(value)).toBe(true);
  });

  it.each([
    ['the empty string', ''],
    ['whitespace only', '   '],
    ['a tab and a newline', '\t\n'],
    ['null', null],
    ['undefined', undefined],
    ['a number', 0],
    ['an object', {}],
  ])('rejects %s', (_case, value) => {
    expect(isNonEmptyString(value)).toBe(false);
  });

  it('narrows the value to a string for the caller', () => {
    const value: unknown = 'Incident summary';

    expect(isNonEmptyString(value) ? value.trim() : 'unreachable').toBe(
      'Incident summary',
    );
  });
});
