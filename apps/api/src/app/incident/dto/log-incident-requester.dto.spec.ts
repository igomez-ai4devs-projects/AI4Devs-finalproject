import { validate } from 'class-validator';
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

const VALID_PAYLOAD = {
  shortDescription: 'Cannot submit match roster',
  description:
    'The roster submission form rejects a valid squad list with no error message.',
};

describe('LogIncidentRequesterDto (T-C1-08)', () => {
  it('accepts a valid payload with no violations', async () => {
    const errors = await validate(toDto(VALID_PAYLOAD));

    expect(errors).toHaveLength(0);
  });

  it('rejects a missing shortDescription', async () => {
    const rest: Record<string, unknown> = { ...VALID_PAYLOAD };
    delete rest.shortDescription;

    const errors = await validate(toDto(rest));

    expect(errors.some((error) => error.property === 'shortDescription')).toBe(
      true,
    );
  });

  it('rejects a whitespace-only shortDescription — IsNotBlank, not merely IsNotEmpty (Trap 2)', async () => {
    const errors = await validate(
      toDto({ ...VALID_PAYLOAD, shortDescription: '   ' }),
    );

    const error = errors.find((e) => e.property === 'shortDescription');
    expect(error?.constraints).toHaveProperty('isNotBlank');
  });

  it('rejects a shortDescription over 255 characters (varchar(255), DATA-MODEL.md §20.3)', async () => {
    const errors = await validate(
      toDto({ ...VALID_PAYLOAD, shortDescription: 'a'.repeat(256) }),
    );

    const error = errors.find((e) => e.property === 'shortDescription');
    expect(error?.constraints).toHaveProperty('maxLength');
  });

  it('accepts a shortDescription of exactly 255 characters', async () => {
    const errors = await validate(
      toDto({ ...VALID_PAYLOAD, shortDescription: 'a'.repeat(255) }),
    );

    expect(errors).toHaveLength(0);
  });

  it('rejects a missing description', async () => {
    const rest: Record<string, unknown> = { ...VALID_PAYLOAD };
    delete rest.description;

    const errors = await validate(toDto(rest));

    expect(errors.some((error) => error.property === 'description')).toBe(true);
  });

  it('rejects a blank description', async () => {
    const errors = await validate(toDto({ ...VALID_PAYLOAD, description: '' }));

    const error = errors.find((e) => e.property === 'description');
    expect(error?.constraints).toHaveProperty('isNotBlank');
  });

  it('accepts an omitted affectedServiceId — optional per DATA-MODEL.md §20.3', async () => {
    const errors = await validate(toDto(VALID_PAYLOAD));

    expect(errors).toHaveLength(0);
  });

  it('accepts a syntactically valid UUID as affectedServiceId', async () => {
    const errors = await validate(
      toDto({
        ...VALID_PAYLOAD,
        affectedServiceId: '0192f3a4-5b6c-7d8e-8f90-123456789abc',
      }),
    );

    expect(errors).toHaveLength(0);
  });

  it('rejects a non-UUID affectedServiceId', async () => {
    const errors = await validate(
      toDto({ ...VALID_PAYLOAD, affectedServiceId: 'not-a-uuid' }),
    );

    const error = errors.find((e) => e.property === 'affectedServiceId');
    expect(error?.constraints).toHaveProperty('isUuid');
  });

  describe('priority-bearing fields (AC1/AC4 — none is declared, so forbidNonWhitelisted rejects it)', () => {
    it.each(['impact', 'urgency', 'priority', 'competitionAffectsInProgress'])(
      'rejects an undeclared "%s" property identically',
      async (field) => {
        const errors = await validate(
          toDto({ ...VALID_PAYLOAD, [field]: 'anything' }),
          { whitelist: true, forbidNonWhitelisted: true },
        );

        const error = errors.find((e) => e.property === field);
        expect(error?.constraints).toHaveProperty('whitelistValidation');
      },
    );
  });
});
