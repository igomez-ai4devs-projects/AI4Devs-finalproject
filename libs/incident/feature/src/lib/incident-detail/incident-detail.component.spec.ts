import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  ErrorCode,
  IncidentDetailResponse,
} from '@sport-itsm/shared-contracts';
import { INCIDENT_MESSAGES, PRIORITY_LABELS } from '../incident-messages';
import { IncidentDetailComponent } from './incident-detail.component';

function detailUrl(reference: string): string {
  return `/api/incidents/${reference}`;
}

const FULLY_EMPTY_INCIDENT: IncidentDetailResponse = {
  reference: 'INC0000001',
  loggedAt: '2026-03-05T10:15:00.000Z',
  originChannel: 'portal',
  shortDescription: 'Cannot submit match roster',
  description: 'The roster submission form times out for every team.',
  affectedServiceId: null,
  categoryId: null,
  impact: null,
  urgency: null,
  priority: null,
  competitionAffectsInProgress: false,
};

const FULLY_ASSESSED_INCIDENT: IncidentDetailResponse = {
  ...FULLY_EMPTY_INCIDENT,
  reference: 'INC0000002',
  affectedServiceId: '11111111-1111-1111-1111-111111111111',
  categoryId: '22222222-2222-2222-2222-222222222222',
  impact: 2,
  urgency: 1,
  priority: 'P1',
  competitionAffectsInProgress: true,
};

describe('IncidentDetailComponent (T-C1-101)', () => {
  let fixture: ComponentFixture<IncidentDetailComponent>;
  let httpMock: HttpTestingController;
  let paramMap$: BehaviorSubject<ParamMap>;

  function setup(initialReference: string): void {
    paramMap$ = new BehaviorSubject<ParamMap>(
      convertToParamMap({ reference: initialReference }),
    );

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: paramMap$.asObservable() },
        },
      ],
    });

    fixture = TestBed.createComponent(IncidentDetailComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock.verify();
  });

  function heading(): HTMLElement {
    return fixture.nativeElement.querySelector('#incident-detail-heading');
  }

  function statusElement(): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="status"]');
  }

  function outcomeElement(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.incident-detail__outcome');
  }

  function fieldsList(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.incident-detail__fields');
  }

  function fieldValue(labelText: string): string | null {
    const dts: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.incident-detail__fields dt'),
    );
    const dt = dts.find((el) => el.textContent?.trim() === labelText);
    return dt
      ? ((dt.nextElementSibling as HTMLElement | null)?.textContent?.trim() ??
          null)
      : null;
  }

  describe('loading state (AC3 — role="status", never blank)', () => {
    it('renders an explicit, announced loading state before the response arrives', () => {
      setup('INC0000001');

      const status = statusElement();
      expect(status).toBeTruthy();
      expect(status?.getAttribute('role')).toBe('status');
      expect(status?.textContent).toContain(
        INCIDENT_MESSAGES.detail.loadingMessage,
      );
      expect(fieldsList()).toBeNull();

      httpMock.expectOne(detailUrl('INC0000001'));
    });

    it('shows the reference being loaded in the heading even before it resolves', () => {
      setup('INC0000001');

      expect(heading().textContent).toContain('INC0000001');

      httpMock.expectOne(detailUrl('INC0000001'));
    });
  });

  describe('loaded state (AC1 — persisted state, not an undefined intermediate one)', () => {
    it('renders every field of a freshly logged Incident with its plain-language empty-state text', () => {
      setup('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(FULLY_EMPTY_INCIDENT);
      fixture.detectChanges();

      expect(statusElement()).toBeNull();
      expect(fieldValue(INCIDENT_MESSAGES.detail.referenceLabel)).toBe(
        'INC0000001',
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.shortDescriptionLabel)).toBe(
        'Cannot submit match roster',
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.descriptionLabel)).toBe(
        'The roster submission form times out for every team.',
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.originChannelLabel)).toBe(
        'Self-service portal',
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.affectedServiceLabel)).toBe(
        INCIDENT_MESSAGES.detail.affectedServiceUnset,
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.categoryLabel)).toBe(
        INCIDENT_MESSAGES.detail.categoryUnset,
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.impactLabel)).toBe(
        INCIDENT_MESSAGES.detail.impactUnset,
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.urgencyLabel)).toBe(
        INCIDENT_MESSAGES.detail.urgencyUnset,
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.priorityLabel)).toBe(
        INCIDENT_MESSAGES.detail.priorityUnset,
      );
      expect(
        fieldValue(INCIDENT_MESSAGES.detail.competitionAffectsInProgressLabel),
      ).toBe(INCIDENT_MESSAGES.detail.no);
    });

    it('never fabricates a value: every rendered field-empty text is a literal reference from the messages file, not a guess', () => {
      setup('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(FULLY_EMPTY_INCIDENT);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toMatch(
        /undefined|null|NaN/,
      );
    });

    it('renders a currently-unreachable but contract-valid fully assessed Incident without guessing a friendly name for a raw id', () => {
      setup('INC0000002');
      httpMock
        .expectOne(detailUrl('INC0000002'))
        .flush(FULLY_ASSESSED_INCIDENT);
      fixture.detectChanges();

      expect(fieldValue(INCIDENT_MESSAGES.detail.affectedServiceLabel)).toBe(
        INCIDENT_MESSAGES.detail.affectedServicePresent,
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.categoryLabel)).toBe(
        INCIDENT_MESSAGES.detail.categoryPresent,
      );
      expect(fieldValue(INCIDENT_MESSAGES.detail.impactLabel)).toBe('2');
      expect(fieldValue(INCIDENT_MESSAGES.detail.urgencyLabel)).toBe('1');
      expect(fieldValue(INCIDENT_MESSAGES.detail.priorityLabel)).toBe(
        PRIORITY_LABELS.P1,
      );
      expect(
        fieldValue(INCIDENT_MESSAGES.detail.competitionAffectsInProgressLabel),
      ).toBe(INCIDENT_MESSAGES.detail.yes);
      // Never the raw UUID: no name-resolution catalog exists yet.
      expect(fixture.nativeElement.textContent).not.toContain(
        '11111111-1111-1111-1111-111111111111',
      );
    });

    it("formats loggedAt in the reader's own locale/time zone, never the raw ISO string (NFR-I18N-03)", () => {
      setup('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(FULLY_EMPTY_INCIDENT);
      fixture.detectChanges();

      const expected = new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(new Date(FULLY_EMPTY_INCIDENT.loggedAt));

      expect(fieldValue(INCIDENT_MESSAGES.detail.loggedAtLabel)).toBe(expected);
      expect(fixture.nativeElement.textContent).not.toContain(
        FULLY_EMPTY_INCIDENT.loggedAt,
      );
    });

    it('uses <dl>/<dt>/<dd> for the field list (AC3 — native semantics)', () => {
      setup('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(FULLY_EMPTY_INCIDENT);
      fixture.detectChanges();

      const list = fieldsList();
      expect(list?.tagName).toBe('DL');
      expect(list?.querySelectorAll('dt').length).toBeGreaterThan(0);
      expect(list?.querySelectorAll('dd').length).toBe(
        list?.querySelectorAll('dt').length,
      );
    });
  });

  describe('not-found state (AC2 — explicit, never blank)', () => {
    it('shows a not-found message for a well-formed reference matching no Incident', () => {
      setup('INC9999999');
      httpMock
        .expectOne(detailUrl('INC9999999'))
        .flush(
          { error: { code: ErrorCode.NOT_FOUND } },
          { status: 404, statusText: 'Not Found' },
        );
      fixture.detectChanges();

      expect(outcomeElement()?.textContent).toContain(
        INCIDENT_MESSAGES.detail.notFoundMessage,
      );
      expect(fieldsList()).toBeNull();
    });

    it('also reports a foreign, well-formed reference (e.g. SRQ…) as not-found, matching the API contract', () => {
      setup('SRQ0000001');
      httpMock
        .expectOne(detailUrl('SRQ0000001'))
        .flush(
          { error: { code: ErrorCode.NOT_FOUND } },
          { status: 404, statusText: 'Not Found' },
        );
      fixture.detectChanges();

      expect(outcomeElement()?.textContent).toContain(
        INCIDENT_MESSAGES.detail.notFoundMessage,
      );
    });
  });

  describe('invalid-reference state (Trap 2 — distinct from not-found)', () => {
    it('shows a different, more actionable message for a malformed reference than for a not-found one', () => {
      setup('not-a-real-reference');
      httpMock.expectOne(detailUrl('not-a-real-reference')).flush(
        {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: [{ field: 'reference', rule: 'matches' }],
          },
        },
        { status: 400, statusText: 'Bad Request' },
      );
      fixture.detectChanges();

      expect(outcomeElement()?.textContent).toContain(
        INCIDENT_MESSAGES.detail.invalidReferenceMessage,
      );
      expect(outcomeElement()?.textContent).not.toContain(
        INCIDENT_MESSAGES.detail.notFoundMessage,
      );
    });
  });

  describe('server-error state (never silent, NFR-USE-05)', () => {
    it('shows a generic message and the correlation id as a support code', () => {
      setup('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(
        { error: { code: ErrorCode.INTERNAL_ERROR } },
        {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'X-Correlation-Id': 'corr-123' },
        },
      );
      fixture.detectChanges();

      const outcome = outcomeElement();
      expect(outcome?.getAttribute('role')).toBe('alert');
      expect(outcome?.textContent).toContain(
        INCIDENT_MESSAGES.detail.genericErrorMessage,
      );
      expect(outcome?.textContent).toContain('corr-123');
    });
  });

  describe('network-error state (never silent)', () => {
    it('shows the network-error message on a connectivity failure', () => {
      setup('INC0000001');
      httpMock
        .expectOne(detailUrl('INC0000001'))
        .error(new ProgressEvent('error'), {
          status: 0,
          statusText: 'Unknown Error',
        });
      fixture.detectChanges();

      expect(outcomeElement()?.textContent).toContain(
        INCIDENT_MESSAGES.detail.networkErrorMessage,
      );
    });
  });

  describe("focus management (T-C1-10's own redirect requirement)", () => {
    it('moves focus to the main heading, which is programmatically focusable', fakeAsync(() => {
      setup('INC0000001');
      tick();

      expect(heading().getAttribute('tabindex')).toBe('-1');
      expect(document.activeElement).toBe(heading());

      httpMock.expectOne(detailUrl('INC0000001'));
    }));
  });

  describe('reference change without destroying the component (Trap 2)', () => {
    it("never shows the previous reference's persisted state, not even for an instant, once a new reference starts loading", () => {
      setup('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(FULLY_EMPTY_INCIDENT);
      fixture.detectChanges();
      expect(fieldValue(INCIDENT_MESSAGES.detail.referenceLabel)).toBe(
        'INC0000001',
      );

      // Simulates the router reusing this component instance across a
      // same-route-config navigation from one reference to another — the
      // only way this transition happens today (there is no in-app link to
      // trigger it; that is `T-C1-101`'s own "out of scope" boundary. This
      // is exactly what `ActivatedRoute.paramMap` emitting a second value
      // looks like from this component's point of view, whatever produced
      // it.
      paramMap$.next(convertToParamMap({ reference: 'INC0000002' }));
      fixture.detectChanges();

      // Synchronous assertion, deliberately before the second HTTP call is
      // flushed: `IncidentStore.loadIncidentByReference` sets its state to
      // `'loading'` before subscribing, so by the time `detectChanges()`
      // above returns, INC0000001's data must already be gone.
      expect(fieldsList()).toBeNull();
      expect(statusElement()).toBeTruthy();
      expect(fixture.nativeElement.textContent).not.toContain('INC0000001');

      httpMock
        .expectOne(detailUrl('INC0000002'))
        .flush({ ...FULLY_EMPTY_INCIDENT, reference: 'INC0000002' });
      fixture.detectChanges();

      expect(fieldValue(INCIDENT_MESSAGES.detail.referenceLabel)).toBe(
        'INC0000002',
      );
    });

    it('re-focuses the main heading when the reference changes on the same component instance', fakeAsync(() => {
      setup('INC0000001');
      tick();
      httpMock.expectOne(detailUrl('INC0000001')).flush(FULLY_EMPTY_INCIDENT);
      fixture.detectChanges();
      tick();

      (document.activeElement as HTMLElement | null)?.blur();
      expect(document.activeElement).not.toBe(heading());

      paramMap$.next(convertToParamMap({ reference: 'INC0000002' }));
      fixture.detectChanges();
      tick();

      expect(document.activeElement).toBe(heading());

      httpMock
        .expectOne(detailUrl('INC0000002'))
        .flush({ ...FULLY_EMPTY_INCIDENT, reference: 'INC0000002' });
      fixture.detectChanges();
    }));
  });
});
