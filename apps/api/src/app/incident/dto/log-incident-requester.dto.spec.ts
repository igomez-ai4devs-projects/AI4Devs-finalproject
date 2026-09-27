import { validate, ValidatorOptions } from 'class-validator';
import { LogIncidentRequesterDto } from './log-incident-requester.dto';

/**
 * `class-validator`'s `validate()` reads decorator metadata keyed by the
 * target *class*, so a plain object must first become an instance of it —
 * exactly what `ValidationPipe`'s own `transform: true` does in production
 * (`main.ts`). No `class-transformer` round trip is needed here: assigning
 * onto a real instance is enough to exercise the same decorators.
 */
function toDto(data: Record<string, unknown>): LogIncidentRequesterDto {
  return Object.assign(new LogIncidentRequesterDto(), data);
}

/**
 * Mirrors the global `ValidationPipe` options this DTO is actually validated
 * under in production (`main.ts`) — most importantly `stopAtFirstError: true`,
 * the option that turns "every decorator on a property fires independently"
 * into "a property stops at its first failing decorator" (see this DTO's own
 * doc comment for why decorator order then decides which rule is reported).
 * A test that called bare `validate(dto)` would exercise a validation regime
 * the API never actually runs.
 */
function validateDto(dto: LogIncidentRequesterDto, options?: ValidatorOptions) {
  return validate(dto, { stopAtFirstError: true, ...options });
}

const VALID_PAYLOAD = {
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
};

describe('LogIncidentRequesterDto (T-C1-08, T-C1-08-follow-up)', () => {
  it('accepts a valid payload with no violations', async () => {
    const errors = await validateDto(toDto(VALID_PAYLOAD));

    expect(errors).toHaveLength(0);
  });

  describe('shortDescription — one detail for the rule actually violated', () => {
    it('a missing shortDescription reports exactly one rule: isDefined', async () => {
      const rest: Record<string, unknown> = { ...VALID_PAYLOAD };
      delete rest.shortDescription;

      const errors = await validateDto(toDto(rest));

      const error = errors.find((e) => e.property === 'shortDescription');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isDefined']);
    });

    it('a null shortDescription reports exactly one rule: isDefined', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, shortDescription: null }),
      );

      const error = errors.find((e) => e.property === 'shortDescription');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isDefined']);
    });

    it('a non-string shortDescription reports exactly one rule: isString — not also isNotBlank/maxLength', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, shortDescription: 12345 }),
      );

      const error = errors.find((e) => e.property === 'shortDescription');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isString']);
    });

    it('a whitespace-only shortDescription reports exactly one rule: isNotBlank (Trap 2 — not merely IsNotEmpty)', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, shortDescription: '   ' }),
      );

      const error = errors.find((e) => e.property === 'shortDescription');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isNotBlank']);
    });

    it('a shortDescription over 255 characters reports exactly one rule: maxLength (varchar(255), DATA-MODEL.md §20.3)', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, shortDescription: 'a'.repeat(256) }),
      );

      const error = errors.find((e) => e.property === 'shortDescription');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['maxLength']);
    });

    it('accepts a shortDescription of exactly 255 characters', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, shortDescription: 'a'.repeat(255) }),
      );

      expect(errors).toHaveLength(0);
    });
  });

  describe('description — one detail for the rule actually violated', () => {
    it('a missing description reports exactly one rule: isDefined', async () => {
      const rest: Record<string, unknown> = { ...VALID_PAYLOAD };
      delete rest.description;

      const errors = await validateDto(toDto(rest));

      const error = errors.find((e) => e.property === 'description');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isDefined']);
    });

    it('a non-string description reports exactly one rule: isString — not also isNotBlank', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, description: 12345 }),
      );

      const error = errors.find((e) => e.property === 'description');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isString']);
    });

    it('a blank description reports exactly one rule: isNotBlank', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, description: '' }),
      );

      const error = errors.find((e) => e.property === 'description');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isNotBlank']);
    });
  });

  it('both shortDescription and description missing at once report one detail per field', async () => {
    const errors = await validateDto(toDto({}));

    const byProperty = new Map(errors.map((e) => [e.property, e.constraints]));
    expect(Object.keys(byProperty.get('shortDescription') ?? {})).toEqual([
      'isDefined',
    ]);
    expect(Object.keys(byProperty.get('description') ?? {})).toEqual([
      'isDefined',
    ]);
  });

  describe('affectedServiceId — optional, so absence is not a violation', () => {
    it('accepts an omitted affectedServiceId — optional per DATA-MODEL.md §20.3', async () => {
      const errors = await validateDto(toDto(VALID_PAYLOAD));

      expect(errors).toHaveLength(0);
    });

    it('accepts a syntactically valid UUID as affectedServiceId', async () => {
      const errors = await validateDto(
        toDto({
          ...VALID_PAYLOAD,
          affectedServiceId: '0192f3a4-5b6c-7d8e-8f90-123456789abc',
        }),
      );

      expect(errors).toHaveLength(0);
    });

    it('a non-UUID affectedServiceId reports exactly one rule: isUuid', async () => {
      const errors = await validateDto(
        toDto({ ...VALID_PAYLOAD, affectedServiceId: 'not-a-uuid' }),
      );

      const error = errors.find((e) => e.property === 'affectedServiceId');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['isUuid']);
    });
  });

  describe('priority-bearing fields (AC1/AC4 — none is declared, so forbidNonWhitelisted rejects it)', () => {
    it.each(['impact', 'urgency', 'priority', 'competitionAffectsInProgress'])(
      'rejects an undeclared "%s" property identically',
      async (field) => {
        const errors = await validateDto(
          toDto({ ...VALID_PAYLOAD, [field]: 'anything' }),
          { whitelist: true, forbidNonWhitelisted: true },
        );

        const error = errors.find((e) => e.property === field);
        expect(error?.constraints).toHaveProperty('whitelistValidation');
      },
    );
  });
});
