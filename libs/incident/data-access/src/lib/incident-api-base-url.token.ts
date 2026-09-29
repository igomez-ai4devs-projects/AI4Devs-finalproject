import { InjectionToken } from '@angular/core';

/**
 * The base URL `IncidentApiService` prefixes every request with
 * (`T-C1-09` Trap 1).
 *
 * **No host, no port.** `apps/web` has no environment configuration and no
 * dev-server proxy yet (`T-C1-09`'s own precondition reading confirmed
 * neither exists), and the API's global prefix is `'api'`
 * (`apps/api/src/app/global-prefix.ts`). Hardcoding `http://localhost:3300`
 * here would bake a deployment topology into a `type:data-access` library
 * that has no business knowing it, and would silently break the moment the
 * API moves behind a different host — this library targets the relative
 * path `'/api'` instead, which resolves against whatever origin the browser
 * loaded `apps/web` from.
 *
 * An `InjectionToken` (not a bare constant import) so `apps/web` — or a
 * future SSR/proxy config — can override the value at the composition root
 * without this library changing. Whether the browser can actually *reach*
 * `/api` in development (an `nx serve web` proxy to port 3300, or CORS on
 * the API) is `apps/web` configuration, out of this ticket's scope, and is
 * reported as a finding for `T-C1-10` — the first ticket that needs a
 * running browser against a running API.
 */
export const INCIDENT_API_BASE_URL = new InjectionToken<string>(
  'INCIDENT_API_BASE_URL',
  {
    providedIn: 'root',
    factory: () => '/api',
  },
);
