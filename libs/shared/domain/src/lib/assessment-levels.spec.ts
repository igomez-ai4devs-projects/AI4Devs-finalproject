import { DomainError } from './domain-error';
import { ImpactLevel, InvalidImpactLevelError } from './impact-level.vo';
import { UrgencyLevel, InvalidUrgencyLevelError } from './urgency-level.vo';

describe('ImpactLevel and UrgencyLevel', () => {
  it.each([1, 2, 3, 4, 5])('accepts level %i on both scales', (value) => {
    expect(ImpactLevel.fromNumber(value).value).toBe(value);
    expect(UrgencyLevel.fromNumber(value).value).toBe(value);
  });

  it.each([
    ['zero', 0],
    ['six', 6],
    ['a negative level', -1],
    ['a fractional level', 2.5],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
  ])('rejects %s on both scales', (_case, value) => {
    expect(() => ImpactLevel.fromNumber(value)).toThrow(
      InvalidImpactLevelError,
    );
    expect(() => UrgencyLevel.fromNumber(value)).toThrow(
      InvalidUrgencyLevelError,
    );
  });

  it('throws a different error type per scale, both under DomainError', () => {
    const impact = (() => {
      try {
        ImpactLevel.fromNumber(9);
        return null;
      } catch (error) {
        return error;
      }
    })();

    expect(impact).toBeInstanceOf(InvalidImpactLevelError);
    expect(impact).toBeInstanceOf(DomainError);
    expect(impact).not.toBeInstanceOf(InvalidUrgencyLevelError);
    expect((impact as InvalidImpactLevelError).offendingValue).toBe(9);
  });

  it('compares by value within a scale', () => {
    expect(ImpactLevel.fromNumber(3).equals(ImpactLevel.fromNumber(3))).toBe(
      true,
    );
    expect(ImpactLevel.fromNumber(3).equals(ImpactLevel.fromNumber(4))).toBe(
      false,
    );
    expect(UrgencyLevel.fromNumber(2).equals(UrgencyLevel.fromNumber(2))).toBe(
      true,
    );
  });

  it('is immutable on both scales', () => {
    const impact = ImpactLevel.fromNumber(3);
    const urgency = UrgencyLevel.fromNumber(3);

    expect(() => {
      (impact as { value: number }).value = 1;
    }).toThrow(TypeError);
    expect(() => {
      (urgency as { value: number }).value = 1;
    }).toThrow(TypeError);
    expect(impact.value).toBe(3);
    expect(urgency.value).toBe(3);
  });
});
