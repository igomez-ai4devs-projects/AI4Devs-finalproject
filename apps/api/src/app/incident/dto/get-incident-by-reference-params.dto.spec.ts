import { validate, ValidatorOptions } from 'class-validator';
import { GetIncidentByReferenceParamsDto } from './get-incident-by-reference-params.dto';

/** Same round trip `log-incident-requester.dto.spec.ts` uses (`ValidationPipe`'s own `transform: true`, `main.ts`). */
function toDto(data: Record<string, unknown>): GetIncidentByReferenceParamsDto {
  return Object.assign(new GetIncidentByReferenceParamsDto(), data);
}

/** Mirrors the global `ValidationPipe` options (`main.ts`) — `stopAtFirstError: true` above all. */
function validateDto(
  dto: GetIncidentByReferenceParamsDto,
  options?: ValidatorOptions,
) {
  return validate(dto, { stopAtFirstError: true, ...options });
}

describe('GetIncidentByReferenceParamsDto (T-C1-100)', () => {
  it('accepts a well-formed reference', async () => {
    const errors = await validateDto(toDto({ reference: 'INC0000123' }));

    expect(errors).toHaveLength(0);
  });

  it('accepts a well-formed reference with a foreign prefix — shape only, not record type (T-C1-100 Trap 2)', async () => {
    const errors = await validateDto(toDto({ reference: 'SRQ0000001' }));

    expect(errors).toHaveLength(0);
  });

  it('a missing reference reports exactly one rule: isDefined', async () => {
    const errors = await validateDto(toDto({}));

    const error = errors.find((e) => e.property === 'reference');
    expect(Object.keys(error?.constraints ?? {})).toEqual(['isDefined']);
  });

  it.each([
    ['too short', 'INC000012'],
    ['too long', 'INC00001234'],
    ['lowercase letters', 'inc0000123'],
    ['wrong prefix length', 'INCC000123'],
    ['non-digit suffix', 'INC000012A'],
  ])(
    'a malformed reference (%s) reports exactly one rule: matches',
    async (_kind, value) => {
      const errors = await validateDto(toDto({ reference: value }));

      const error = errors.find((e) => e.property === 'reference');
      expect(Object.keys(error?.constraints ?? {})).toEqual(['matches']);
    },
  );

  it('rejects an undeclared property (forbidNonWhitelisted parity with the request DTOs)', async () => {
    const errors = await validateDto(
      toDto({ reference: 'INC0000123', extra: 'nope' }),
      { whitelist: true, forbidNonWhitelisted: true },
    );

    const error = errors.find((e) => e.property === 'extra');
    expect(error?.constraints).toHaveProperty('whitelistValidation');
  });
});
