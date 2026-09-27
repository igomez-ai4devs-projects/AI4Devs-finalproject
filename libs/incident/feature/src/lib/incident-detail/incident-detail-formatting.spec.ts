import { formatLoggedAt } from './incident-detail-formatting';

describe('formatLoggedAt (NFR-I18N-03)', () => {
  it('formats an ISO 8601 UTC instant using the runtime default locale/time zone, never the raw string', () => {
    const iso = '2026-03-05T10:15:00.000Z';

    const result = formatLoggedAt(iso);

    expect(result).not.toBe(iso);
    expect(result).toBe(
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(new Date(iso)),
    );
  });
});
