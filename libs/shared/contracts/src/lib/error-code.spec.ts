import { ErrorCode } from './error-code';

describe('ErrorCode', () => {
  it('is seeded with exactly the four codes T-C10-11 names plus T-C1-08’s INTERNAL_ERROR, no more', () => {
    expect(Object.keys(ErrorCode).sort()).toEqual(
      [
        'FORBIDDEN',
        'INTERNAL_ERROR',
        'NOT_FOUND',
        'UNAUTHENTICATED',
        'VALIDATION_FAILED',
      ].sort(),
    );
  });

  it('is a value, not only a type — every key maps to its own name', () => {
    expect(ErrorCode.UNAUTHENTICATED).toBe('UNAUTHENTICATED');
    expect(ErrorCode.FORBIDDEN).toBe('FORBIDDEN');
    expect(ErrorCode.VALIDATION_FAILED).toBe('VALIDATION_FAILED');
    expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
  });
});
