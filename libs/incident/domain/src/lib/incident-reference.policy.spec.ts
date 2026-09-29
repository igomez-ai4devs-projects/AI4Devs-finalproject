import { DomainError, TicketReference } from '@sport-itsm/shared-domain';
import {
  IncidentReferencePolicy,
  IncidentReferencePrefixMismatchError,
  IncidentReferenceSequenceOutOfRangeError,
} from './incident-reference.policy';

describe('IncidentReferencePolicy', () => {
  describe('format', () => {
    it.each([
      [1, 'INC0000001'],
      [123, 'INC0000123'],
      [9_999_999, 'INC9999999'],
    ])('renders sequence value %i as %s', (sequenceValue, expected) => {
      expect(IncidentReferencePolicy.format(sequenceValue).value).toBe(
        expected,
      );
    });

    it('matches the documented shape exactly: three letters, seven digits, no separator', () => {
      const reference = IncidentReferencePolicy.format(42);

      expect(reference.value).toMatch(/^[A-Z]{3}[0-9]{7}$/);
      expect(reference.value).toHaveLength(10);
    });

    it('is unambiguous when read aloud: the prefix is always the same fixed letters, occupying only the first three positions, and every remaining position is always a digit', () => {
      const values = [1, 123, 9_999_999].map(
        (sequenceValue) => IncidentReferencePolicy.format(sequenceValue).value,
      );

      for (const value of values) {
        const prefix = value.slice(0, 3);
        const numericPart = value.slice(3);
        // The prefix never varies (nothing to disambiguate between references)
        // and never contains a digit; the numeric part never contains a
        // letter — so no position ever requires guessing letter vs. digit.
        expect(prefix).toBe('INC');
        expect(numericPart).toMatch(/^[0-9]{7}$/);
      }
    });

    it('accepts the upper bound of the seven-digit numeric part', () => {
      expect(() => IncidentReferencePolicy.format(9_999_999)).not.toThrow();
    });

    it.each([
      ['zero', 0],
      ['a negative value', -1],
      ['a non-integer value', 1.5],
      ['a value past the seven-digit ceiling', 10_000_000],
      ['NaN', NaN],
    ])(
      'rejects %s with a typed, distinguishable error',
      (_case, sequenceValue) => {
        expect(() => IncidentReferencePolicy.format(sequenceValue)).toThrow(
          IncidentReferenceSequenceOutOfRangeError,
        );
      },
    );

    it('carries the rejected value on the typed error', () => {
      expect.assertions(3);
      try {
        IncidentReferencePolicy.format(10_000_000);
      } catch (error) {
        expect(error).toBeInstanceOf(IncidentReferenceSequenceOutOfRangeError);
        expect(error).toBeInstanceOf(DomainError);
        expect(
          (error as IncidentReferenceSequenceOutOfRangeError)
            .offendingSequenceValue,
        ).toBe(10_000_000);
      }
    });
  });

  describe('parse', () => {
    it.each([1, 123, 9_999_999])(
      'round-trips sequence value %i through format and parse',
      (sequenceValue) => {
        const reference = IncidentReferencePolicy.format(sequenceValue);

        expect(IncidentReferencePolicy.parse(reference)).toBe(sequenceValue);
      },
    );

    it('rejects a reference from another record type with a typed, distinguishable error', () => {
      const serviceRequestReference = TicketReference.fromString('SRQ0000045');

      expect(() =>
        IncidentReferencePolicy.parse(serviceRequestReference),
      ).toThrow(IncidentReferencePrefixMismatchError);
    });

    it('carries the rejected reference on the typed error', () => {
      expect.assertions(3);
      const serviceRequestReference = TicketReference.fromString('SRQ0000045');
      try {
        IncidentReferencePolicy.parse(serviceRequestReference);
      } catch (error) {
        expect(error).toBeInstanceOf(IncidentReferencePrefixMismatchError);
        expect(error).toBeInstanceOf(DomainError);
        expect(
          (error as IncidentReferencePrefixMismatchError).offendingReference,
        ).toBe('SRQ0000045');
      }
    });
  });
});
