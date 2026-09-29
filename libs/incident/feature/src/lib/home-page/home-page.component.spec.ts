import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { INCIDENT_INTAKE_URL } from '../incident-routes';
import { INCIDENT_MESSAGES } from '../incident-messages';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent (T-C1-103)', () => {
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Empty route table: `RouterLink` only needs a `Router` to resolve
      // `href` from `intakeUrl` — this component never navigates through it
      // itself and this page registers no route of its own.
      providers: [provideRouter([])],
    });

    fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
  });

  function headings(): HTMLHeadingElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('h1'));
  }

  function links(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('a'));
  }

  describe('AC1 — exactly one <h1>, sourced from INCIDENT_MESSAGES.home', () => {
    it('renders a single page heading with the exact heading text', () => {
      const h1s = headings();
      expect(h1s.length).toBe(1);
      expect(h1s[0].textContent?.trim()).toBe(INCIDENT_MESSAGES.home.heading);
    });
  });

  describe('AC2 — exactly one routerLink to the intake form, resolving to /incidents/new', () => {
    it('renders a single anchor, built from INCIDENT_INTAKE_URL, never a hardcoded literal', () => {
      expect(INCIDENT_INTAKE_URL).toBe('/incidents/new');

      const anchors = links();
      expect(anchors.length).toBe(1);
      expect(anchors[0].getAttribute('href')).toBe('/incidents/new');
      expect(anchors[0].textContent?.trim()).toBe(
        INCIDENT_MESSAGES.home.linkLabel,
      );
    });

    it('uses routerLink, not a plain absolute href, to build the anchor', () => {
      const anchor = links()[0];
      expect(anchor.getAttribute('routerLink')).toBeNull();
      // `routerLink` is a directive input, not a reflected attribute; its
      // effect (the computed `href`) is asserted above. This test only
      // guards against the anchor accidentally acquiring a second, plain
      // `href` binding that would bypass the router.
      expect(anchor.outerHTML).not.toMatch(/href="https?:\/\//);
    });
  });

  describe('AC5 — every rendered string is a reference into INCIDENT_MESSAGES.home', () => {
    it('renders the introductory copy from the constants file', () => {
      expect(fixture.nativeElement.textContent).toContain(
        INCIDENT_MESSAGES.home.intro,
      );
    });

    it('renders no other literal text besides the three home strings', () => {
      // Compared with whitespace stripped entirely, not just collapsed: the
      // Angular template compiler removes insignificant whitespace between
      // block-level elements (`preserveWhitespaces: false`, the workspace
      // default), so no separator space is guaranteed between adjacent
      // elements' text content.
      const collapsedText: string = (
        fixture.nativeElement.textContent as string
      ).replace(/\s+/g, '');
      const expectedText = [
        INCIDENT_MESSAGES.home.heading,
        INCIDENT_MESSAGES.home.intro,
        INCIDENT_MESSAGES.home.linkLabel,
      ]
        .join('')
        .replace(/\s+/g, '');
      expect(collapsedText).toBe(expectedText);
    });
  });
});
