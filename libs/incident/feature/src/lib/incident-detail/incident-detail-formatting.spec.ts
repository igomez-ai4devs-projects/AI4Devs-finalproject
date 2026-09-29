import {
  DATE_DISPLAY_LOCALE,
  formatLoggedAt,
} from './incident-detail-formatting';

describe('formatLoggedAt (NFR-I18N-03, Spanish pinned for the demo)', () => {
  it('formats an ISO 8601 UTC instant in Spanish and the runtime time zone, never the raw string', () => {
    const iso = '2026-03-05T10:15:00.000Z';

    const result = formatLoggedAt(iso);

    expect(result).not.toBe(iso);
    expect(result).toBe(
      new Intl.DateTimeFormat(DATE_DISPLAY_LOCALE, {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(new Date(iso)),
    );
  });

  it('renders the month name in Spanish whatever the runtime default locale is', () => {
    // Mid-month, mid-day UTC: no time zone on Earth moves it out of March.
    expect(formatLoggedAt('2026-03-15T12:00:00.000Z')).toContain('marzo');
  });
});
