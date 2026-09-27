import { Route } from '@angular/router';
import { IncidentIntakeFormComponent } from './intake-form/incident-intake-form.component';
import { IncidentDetailComponent } from './incident-detail/incident-detail.component';
import { INCIDENT_MESSAGES } from './incident-messages';

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
 * `T-C1-101` registers the sibling entry below (`{ path: ':reference',
 * component: IncidentDetailComponent }`) that resolves this URL. Before that
 * ticket, a navigation here matched no route inside this library's own
 * children, so the router backtracked out of the lazy-loaded `incidents`
 * match entirely and fell through to the shell's wildcard route
 * (`apps/web/src/app/app.routes.ts`), which redirects home — `T-C1-10`'s own
 * acceptance suite documented that as an expected, temporary gap.
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
 * **Order matters (`T-C1-101` Trap 3).** `:reference` is declared *after*
 * `INCIDENT_INTAKE_ROUTE_PATH` ('new'), never before it. The Angular router
 * tries a lazy-loaded library's children in array order and resolves the
 * first match; `:reference` matches any single path segment, including the
 * literal `new`. Listing it first would make `/incidents/new` resolve to the
 * detail screen with `reference: 'new'` instead of the intake form, silently
 * breaking `T-C1-10`'s own route. Keeping the static segment first is the
 * standard Angular routing rule for a static path competing with a sibling
 * parameterized one.
 */
export const incidentRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: INCIDENT_INTAKE_ROUTE_PATH },
  {
    path: INCIDENT_INTAKE_ROUTE_PATH,
    component: IncidentIntakeFormComponent,
  },
  {
    path: ':reference',
    component: IncidentDetailComponent,
    title: INCIDENT_MESSAGES.detail.pageTitle,
  },
];
