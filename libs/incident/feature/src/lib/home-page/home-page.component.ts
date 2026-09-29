import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INCIDENT_INTAKE_URL } from '../incident-routes';
import { INCIDENT_MESSAGES } from '../incident-messages';

/**
 * The web surface's home page at `/` (`T-C1-103`) — the Render demo's own
 * landing page, `loadComponent`-mounted straight on the shell's `''` route
 * (`apps/web/src/app/app.routes.ts`), not nested under this library's own
 * `/incidents` prefix the way `incidentRoutes`' screens are. It exists so a
 * person opening the deployed URL lands somewhere legible before ever seeing
 * the intake form — the smallest fragment of the eventual `C9` self-service
 * portal (`FR-KNW-08`); this ticket's own "Context" section records that
 * reassignment.
 *
 * Composition-root purity carries over from the shell it is mounted on
 * (`AppComponent`'s own doc comment): no injected service, no store, no
 * `HttpClient`, no ITSM vocabulary — plain language throughout, sourced
 * exclusively from `INCIDENT_MESSAGES.home`, never a template literal.
 *
 * Its single interactive element is a normal, focusable `<a routerLink>` to
 * the intake form — never a plain `href`, and never a second navigation
 * target — so no custom keyboard handling is needed: native anchor semantics
 * already give Tab-to-focus and Enter/Space-to-activate for free.
 */
@Component({
  selector: 'incident-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  protected readonly messages = INCIDENT_MESSAGES.home;

  /**
   * Built from `INCIDENT_INTAKE_ROUTE_PATH` via `incident-routes.ts`'s own
   * `INCIDENT_INTAKE_URL` — never a hardcoded `'/incidents/new'` literal
   * repeated a third time (`T-C1-103` Trap 1).
   */
  protected readonly intakeUrl = INCIDENT_INTAKE_URL;
}
