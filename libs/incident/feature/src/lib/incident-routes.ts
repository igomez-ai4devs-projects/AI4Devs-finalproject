import { Route } from '@angular/router';
import { IncidentIntakeFormComponent } from './intake-form/incident-intake-form.component';

/**
 * Path segment for the requester intake form, relative to this library's own
 * mount point. The shell (`apps/web/src/app/app.routes.ts`) `loadChildren`s
 * this library at `/incidents`, so the resolved URL is `/incidents/new`.
 * Exported as a named constant — not repeated as a literal — so this route
 * table and the component's own navigation logic can never drift on the
 * segment name.
 */
export const INCIDENT_INTAKE_ROUTE_PATH = 'new';

/**
 * Absolute URL of an Incident's detail screen for a given reference. Declared
 * here, in the one file that owns both today's writer (the intake form
 * navigates here on success, `T-C1-10` AC4, deviation 3) and the future
 * reader (`T-C1-101`'s own route registration), so the two can never name
 * the segment differently.
 *
 * `T-C1-101` is **not built by this ticket**. Until it adds a sibling entry
 * to {@link incidentRoutes} below (`{ path: ':reference', component: ... }`),
 * a navigation to this URL matches no route inside this library's own
 * children, so the router backtracks out of the lazy-loaded `incidents`
 * match entirely and falls through to the shell's wildcard route
 * (`apps/web/src/app/app.routes.ts`), which redirects home. That is expected
 * and reported as a finding, not a bug in this ticket.
 */
export const incidentDetailUrl = (reference: string): string =>
  `/incidents/${reference}`;

/**
 * `libs/incident/feature`'s routed surface, `loadChildren`-mounted at
 * `/incidents` by the shell (`ARCHITECTURE.md` §7.1). This delivery slice has
 * exactly one screen, so a bare `/incidents` visit redirects straight to it
 * rather than resolving to an empty child (`T-C1-10` Trap 4) — a requester
 * landing on this prefix overwhelmingly means "I want to report something".
 *
 * `T-C1-101` adds a sibling route here (`path: ':reference'`, reusing
 * {@link incidentDetailUrl}'s own segment shape) once the detail screen
 * exists; it does not touch the entries already declared below.
 */
export const incidentRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: INCIDENT_INTAKE_ROUTE_PATH },
  {
    path: INCIDENT_INTAKE_ROUTE_PATH,
    component: IncidentIntakeFormComponent,
  },
];
