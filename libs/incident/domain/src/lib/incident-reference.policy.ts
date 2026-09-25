import { DomainError, TicketReference } from '@sport-itsm/shared-domain';

/**
 * The Incident record-type prefix (`DATA-MODEL.md` §3.2). Fixed — the shared
 * kernel does not enumerate prefixes (`ticket-reference.vo.ts`), so owning the
 * literal is this context's responsibility, not the kernel's.
 */
const INCIDENT_PREFIX = 'INC';

/**
 * `TicketReference.value` reserves exactly seven digits for the numeric part
 * (`^[A-Z]{3}[0-9]{7}$`). The smallest representable value keeps the leading
 * zeros the documented shape (`INC0000123`) requires; the largest is the
 * highest seven-digit number.
 */
const MIN_SEQUENCE_VALUE = 1;
const MAX_SEQUENCE_VALUE = 9_999_999;

/**
 * Thrown when a database sequence value cannot be rendered as an Incident
 * reference: not a positive integer, or past the seven-digit ceiling
 * (`DATA-MODEL.md` §3.2).
 *
 * The ceiling is a real, if distant, failure mode: `incident.incident_reference_seq`
 * is a PostgreSQL `SEQUENCE`, unbounded by default, while the reference's
 * numeric part is fixed at seven digits. Truncating or wrapping the value
 * would let a new incident reuse a digit sequence an old one already used —
 * exactly what FR-INC-02's "never reused" rules out — so exhaustion is a typed
 * domain error instead, raised loudly the first time it would happen.
 */
export class IncidentReferenceSequenceOutOfRangeError extends DomainError {
  constructor(readonly offendingSequenceValue: unknown) {
    super(
      `Incident reference sequence value must be an integer between ${MIN_SEQUENCE_VALUE} and ${MAX_SEQUENCE_VALUE}; received ${String(offendingSequenceValue)}`,
      offendingSequenceValue,
    );
  }
}

/**
 * Thrown when `IncidentReferencePolicy.parse()` is given a `TicketReference`
 * that belongs to another record type. The kernel VO only guarantees the
 * shared shape (three letters, seven digits); which three letters mean
 * "Incident" is this policy's own vocabulary.
 */
export class IncidentReferencePrefixMismatchError extends DomainError {
  constructor(readonly offendingReference: unknown) {
    super(
      `TicketReference does not belong to the Incident record type (expected prefix "${INCIDENT_PREFIX}"); received ${String(offendingReference)}`,
      offendingReference,
    );
  }
}

/**
 * The Incident context's policy over the shared-kernel `TicketReference`
 * (`ARCHITECTURE.md` §6.2, `DATA-MODEL.md` §3.2).
 *
 * It does not generate a reference — the numeric part always comes from
 * `incident.incident_reference_seq`, read by the repository adapter behind
 * `IncidentRepositoryPort.nextReference()` (out of scope here, `T-C1-04`).
 * This policy only knows how to turn that sequence value into the documented
 * shape and back: `INC` + seven zero-padded digits, no separator.
 *
 * Unambiguous when read aloud by construction, not by convention: the prefix
 * occupies fixed positions 0–2 and is always alphabetic, the numeric part
 * occupies fixed positions 3–9 and is always digits, and the prefix itself is
 * one constant literal (`"INC"`) rather than a value chosen per reference. A
 * listener never has to decide whether a symbol in a given position is a
 * letter or a digit, and never has to distinguish one prefix from another —
 * the round-trip and shape tests demonstrate this directly rather than
 * asserting it in a comment.
 *
 * Stateless by design (YAGNI) — a static utility, not a value object: it
 * holds no data of its own, only renders and reads the kernel VO.
 */
export class IncidentReferencePolicy {
  private constructor() {
    // Not instantiable: every member is static, there is no state to hold.
  }

  /**
   * Renders a sequence value as an Incident `TicketReference`.
   *
   * @throws {IncidentReferenceSequenceOutOfRangeError} when `sequenceValue` is
   * not an integer in `[1, 9_999_999]`.
   */
  static format(sequenceValue: number): TicketReference {
    if (
      !Number.isInteger(sequenceValue) ||
      sequenceValue < MIN_SEQUENCE_VALUE ||
      sequenceValue > MAX_SEQUENCE_VALUE
    ) {
      throw new IncidentReferenceSequenceOutOfRangeError(sequenceValue);
    }
    const numericPart = String(sequenceValue).padStart(7, '0');
    return TicketReference.fromString(`${INCIDENT_PREFIX}${numericPart}`);
  }

  /**
   * Recovers the sequence value a `TicketReference` was rendered from.
   *
   * @throws {IncidentReferencePrefixMismatchError} when `reference` does not
   * carry the Incident prefix.
   */
  static parse(reference: TicketReference): number {
    if (reference.prefix !== INCIDENT_PREFIX) {
      throw new IncidentReferencePrefixMismatchError(reference.value);
    }
    return Number(reference.value.slice(INCIDENT_PREFIX.length));
  }
}
