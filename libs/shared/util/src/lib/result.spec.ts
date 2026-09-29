import { err, isErr, isOk, ok, type Result } from './result';

describe('Result', () => {
  describe('ok', () => {
    it('carries the value on the success branch', () => {
      const result = ok('INC-0001');

      expect(result).toEqual({ ok: true, value: 'INC-0001' });
    });
  });

  describe('err', () => {
    it('carries the error on the failure branch', () => {
      const result = err({ code: 'SLA_POLICY_NOT_FOUND' });

      expect(result).toEqual({
        ok: false,
        error: { code: 'SLA_POLICY_NOT_FOUND' },
      });
    });
  });

  describe('narrowing', () => {
    it('exposes the value once the success branch is discriminated', () => {
      const result: Result<number, string> = ok(4);

      expect(result.ok ? result.value : 'unreachable').toBe(4);
    });

    it('exposes the error once the failure branch is discriminated', () => {
      const result: Result<number, string> = err('rejected');

      expect(result.ok ? 'unreachable' : result.error).toBe('rejected');
    });
  });

  describe('guards', () => {
    it('keeps only the successes when used as a predicate', () => {
      const results: Result<number, string>[] = [ok(1), err('rejected'), ok(3)];

      expect(results.filter(isOk).map((result) => result.value)).toEqual([
        1, 3,
      ]);
    });

    it('keeps only the failures when used as a predicate', () => {
      const results: Result<number, string>[] = [ok(1), err('rejected'), ok(3)];

      expect(results.filter(isErr).map((result) => result.error)).toEqual([
        'rejected',
      ]);
    });
  });
});
