import { DomainError } from './domain-error';
import {
  TicketReference,
  InvalidTicketReferenceError,
} from './ticket-reference.vo';

describe('TicketReference', () => {
  it.each([
    ['an incident reference', 'INC0000123'],
    ['a service request reference', 'SRQ0000045'],
  ])('accepts %s', (_case, value) => {
    expect(TicketReference.fromString(value).value).toBe(value);
  });

  it('exposes the record-type prefix without enumerating the known set', () => {
    expect(TicketReference.fromString('INC0000123').prefix).toBe('INC');
    expect(TicketReference.fromString('PRB0000001').prefix).toBe('PRB');
  });

  it.each([
    ['a lowercase prefix', 'inc0000123'],
    ['too few digits', 'INC000123'],
    ['too many digits', 'INC00001234'],
    ['a two-letter prefix', 'IN00000123'],
    ['a separator', 'INC-0000123'],
    ['the empty string', ''],
  ])('rejects %s', (_case, value) => {
    expect(() => TicketReference.fromString(value)).toThrow(
      InvalidTicketReferenceError,
    );
  });

  it('throws an error distinguishable by type and carrying the rejected value', () => {
    expect.assertions(3);
    try {
      TicketReference.fromString('nope');
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidTicketReferenceError);
      expect(error).toBeInstanceOf(DomainError);
      expect((error as InvalidTicketReferenceError).offendingValue).toBe(
        'nope',
      );
    }
  });

  it('is equal only to the same reference', () => {
    const reference = TicketReference.fromString('INC0000123');
    expect(reference.equals(TicketReference.fromString('INC0000123'))).toBe(
      true,
    );
    expect(reference.equals(TicketReference.fromString('SRQ0000123'))).toBe(
      false,
    );
  });

  it('is immutable', () => {
    const reference = TicketReference.fromString('INC0000123');
    expect(() => {
      (reference as { value: string }).value = 'INC9999999';
    }).toThrow(TypeError);
    expect(reference.value).toBe('INC0000123');
  });
});
