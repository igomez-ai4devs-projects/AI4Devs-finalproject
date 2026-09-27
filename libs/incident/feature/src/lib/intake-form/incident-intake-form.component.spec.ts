import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorCode } from '@sport-itsm/shared-contracts';
import { IncidentStore } from '@sport-itsm/incident-data-access';
import { INCIDENT_MESSAGES } from '../incident-messages';
import { IncidentIntakeFormComponent } from './incident-intake-form.component';

const INTAKE_URL = '/api/incidents';

function setInputValue(
  input: HTMLInputElement | HTMLTextAreaElement,
  value: string,
): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('IncidentIntakeFormComponent (T-C1-10)', () => {
  let fixture: ComponentFixture<IncidentIntakeFormComponent>;
  let component: IncidentIntakeFormComponent;
  let httpMock: HttpTestingController;
  let router: { navigateByUrl: jest.Mock };

  beforeEach(() => {
    router = { navigateByUrl: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });

    fixture = TestBed.createComponent(IncidentIntakeFormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function shortDescriptionInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('#incident-short-description');
  }

  function descriptionInput(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('#incident-description');
  }

  function submitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.incident-intake__submit');
  }

  function fillValidForm(): void {
    setInputValue(shortDescriptionInput(), 'Cannot submit match roster');
    setInputValue(
      descriptionInput(),
      'The roster submission form times out for every team.',
    );
    fixture.detectChanges();
  }

  describe('AC1 — no priority-bearing control anywhere in the rendered DOM', () => {
    it('renders no Impact, Urgency, Priority or competition-in-progress control', () => {
      const html: string = fixture.nativeElement.innerHTML;
      expect(html).not.toMatch(/impact|urgency|priority|competitionAffects/i);
    });

    it('sends no affectedServiceId control', () => {
      expect(component['form'].contains('affectedServiceId')).toBe(false);
    });
  });

  describe('client-side validation (mirrors the server, NFR-USE-05)', () => {
    it('does not call the API and shows both field messages when the form is empty', () => {
      submitButton().click();
      fixture.detectChanges();

      httpMock.expectNone(INTAKE_URL);

      const summary = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary',
      );
      expect(summary).toBeTruthy();
      expect(summary.textContent).toContain(
        INCIDENT_MESSAGES.validation.shortDescription.isNotBlank,
      );
      expect(summary.textContent).toContain(
        INCIDENT_MESSAGES.validation.description.isNotBlank,
      );
    });

    it('rejects a whitespace-only value the same way as an empty one', () => {
      setInputValue(shortDescriptionInput(), '   ');
      setInputValue(descriptionInput(), 'Some real detail here.');
      fixture.detectChanges();

      submitButton().click();
      fixture.detectChanges();

      httpMock.expectNone(INTAKE_URL);
      expect(
        fixture.nativeElement.querySelector('#incident-short-description-error')
          .textContent,
      ).toContain(INCIDENT_MESSAGES.validation.shortDescription.isNotBlank);
    });

    it('rejects a shortDescription over 255 characters with the maxLength message', () => {
      setInputValue(shortDescriptionInput(), 'a'.repeat(256));
      setInputValue(descriptionInput(), 'Some real detail here.');
      fixture.detectChanges();

      submitButton().click();
      fixture.detectChanges();

      httpMock.expectNone(INTAKE_URL);
      expect(
        fixture.nativeElement.querySelector('#incident-short-description-error')
          .textContent,
      ).toContain(INCIDENT_MESSAGES.validation.shortDescription.maxLength);
    });

    it('marks an invalid control aria-invalid and links its input from the error summary', () => {
      submitButton().click();
      fixture.detectChanges();

      expect(shortDescriptionInput().getAttribute('aria-invalid')).toBe('true');
      const link = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary a',
      ) as HTMLAnchorElement;
      expect(link.getAttribute('href')).toBe('#incident-short-description');
    });
  });

  describe('submission and the store (T-C1-09)', () => {
    it('sends a trimmed request and disables the submit button while in flight', () => {
      fillValidForm();

      submitButton().click();
      fixture.detectChanges();

      expect(submitButton().disabled).toBe(true);
      expect(submitButton().textContent).toContain(
        INCIDENT_MESSAGES.intakeForm.submitPendingLabel,
      );

      const req = httpMock.expectOne(INTAKE_URL);
      expect(req.request.body).toEqual({
        shortDescription: 'Cannot submit match roster',
        description: 'The roster submission form times out for every team.',
      });
      req.flush(
        { reference: 'INC0000001' },
        { status: 201, statusText: 'Created' },
      );
    });

    it('navigates to the detail route at the returned reference on success (AC4)', async () => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { reference: 'INC0000001' },
          { status: 201, statusText: 'Created' },
        );

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/incidents/INC0000001',
      );
    });

    it('does not navigate on mount just because the (shared) store already holds a stale reference from an earlier submission', async () => {
      // Simulate a previous, unrelated submission having already succeeded on
      // this root-singleton store (see the component's own doc comment on
      // its navigation effect).
      const store = TestBed.inject(IncidentStore);
      store.logIncidentAsRequester({
        shortDescription: 'Earlier report',
        description: 'Earlier detail',
      });
      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { reference: 'INC0000099' },
          { status: 201, statusText: 'Created' },
        );
      await fixture.whenStable();
      router.navigateByUrl.mockClear();

      // A freshly created instance of the component must not redirect away
      // before the requester has done anything.
      const freshFixture = TestBed.createComponent(IncidentIntakeFormComponent);
      freshFixture.detectChanges();
      await freshFixture.whenStable();

      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('maps a VALIDATION_FAILED server response to the same field messages (NFR-USE-05)', () => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      httpMock.expectOne(INTAKE_URL).flush(
        {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: [{ field: 'shortDescription', rule: 'maxLength' }],
          },
        },
        { status: 400, statusText: 'Bad Request' },
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('#incident-short-description-error')
          .textContent,
      ).toContain(INCIDENT_MESSAGES.validation.shortDescription.maxLength);
    });

    it('falls back to a generic message for a rule this form does not recognize', () => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      httpMock.expectOne(INTAKE_URL).flush(
        {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: [{ field: 'shortDescription', rule: 'isUuid' }],
          },
        },
        { status: 400, statusText: 'Bad Request' },
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('#incident-short-description-error')
          .textContent,
      ).toContain('Please check this field and try again.');
    });

    it('shows a generic message for a detail naming a field this form renders no control for', () => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      httpMock.expectOne(INTAKE_URL).flush(
        {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: [{ field: 'affectedServiceId', rule: 'isUuid' }],
          },
        },
        { status: 400, statusText: 'Bad Request' },
      );
      fixture.detectChanges();

      const summary = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary',
      );
      expect(summary.textContent).toContain(
        INCIDENT_MESSAGES.intakeForm.genericErrorMessage,
      );
    });

    it('shows the network-error message on a connectivity failure, never silently', () => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      httpMock.expectOne(INTAKE_URL).error(new ProgressEvent('error'), {
        status: 0,
        statusText: 'Unknown Error',
      });
      fixture.detectChanges();

      const summary = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary',
      );
      expect(summary.textContent).toContain(
        INCIDENT_MESSAGES.intakeForm.networkErrorMessage,
      );
    });

    it('shows the correlation id as a support code when the server sends one', () => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      const req = httpMock.expectOne(INTAKE_URL);
      req.flush(
        { error: { code: ErrorCode.INTERNAL_ERROR } },
        {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'X-Correlation-Id': 'corr-123' },
        },
      );
      fixture.detectChanges();

      const summary = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary',
      );
      expect(summary.textContent).toContain('corr-123');
    });
  });

  describe('focus management (AC2)', () => {
    it('moves focus to the error summary after a client-side validation failure', fakeAsync(() => {
      submitButton().click();
      fixture.detectChanges();
      tick();

      const summary: HTMLElement = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary',
      );
      expect(document.activeElement).toBe(summary);
    }));

    it('moves focus to the error summary after a server-side validation failure', fakeAsync(() => {
      fillValidForm();
      submitButton().click();
      fixture.detectChanges();

      httpMock.expectOne(INTAKE_URL).flush(
        {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: [{ field: 'shortDescription', rule: 'maxLength' }],
          },
        },
        { status: 400, statusText: 'Bad Request' },
      );
      fixture.detectChanges();
      tick();

      const summary: HTMLElement = fixture.nativeElement.querySelector(
        '.incident-intake__error-summary',
      );
      expect(document.activeElement).toBe(summary);
    }));
  });
});
