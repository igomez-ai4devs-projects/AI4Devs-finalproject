import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ErrorCode,
  IncidentDetailResponse,
  LogIncidentRequesterRequest,
} from '@sport-itsm/shared-contracts';
import { IncidentStore } from './incident.store';

const INTAKE_URL = '/api/incidents';
const detailUrl = (reference: string) => `/api/incidents/${reference}`;

const INTAKE_REQUEST: LogIncidentRequesterRequest = {
  shortDescription: 'Cannot submit match roster',
  description: 'The roster submission form times out for every team.',
};

const DETAIL_RESPONSE_A: IncidentDetailResponse = {
  reference: 'INC0000001',
  loggedAt: '2026-09-27T10:00:00.000Z',
  originChannel: 'portal',
  shortDescription: 'A',
  description: 'A',
  affectedServiceId: null,
  categoryId: null,
  impact: null,
  urgency: null,
  priority: null,
  competitionAffectsInProgress: false,
};

const DETAIL_RESPONSE_B: IncidentDetailResponse = {
  ...DETAIL_RESPONSE_A,
  reference: 'INC0000002',
  shortDescription: 'B',
  description: 'B',
};

describe('IncidentStore (T-C1-09)', () => {
  let store: IncidentStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(IncidentStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('every state before any call', () => {
    it('starts with loading false, error null and data null for both operations (AC1/AC2/AC5)', () => {
      expect(store.intakeLoading()).toBe(false);
      expect(store.intakeError()).toBeNull();
      expect(store.createdIncidentReference()).toBeNull();
      expect(store.detailLoading()).toBe(false);
      expect(store.detailError()).toBeNull();
      expect(store.incidentDetail()).toBeNull();
    });
  });

  describe('intake — POST /api/incidents', () => {
    it('is loading, with no data and no error, while the request is in flight', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);

      expect(store.intakeLoading()).toBe(true);
      expect(store.intakeError()).toBeNull();
      expect(store.createdIncidentReference()).toBeNull();

      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { reference: 'INC0000001' },
          { status: 201, statusText: 'Created' },
        );
    });

    it('settles into data, no loading and no error on success (AC1)', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);
      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { reference: 'INC0000001' },
          { status: 201, statusText: 'Created' },
        );

      expect(store.intakeLoading()).toBe(false);
      expect(store.intakeError()).toBeNull();
      expect(store.createdIncidentReference()).toBe('INC0000001');
    });

    it('settles into a typed VALIDATION_FAILED error, with no loading, on a 400 (AC2)', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);

      httpMock.expectOne(INTAKE_URL).flush(
        {
          error: {
            code: ErrorCode.VALIDATION_FAILED,
            details: [{ field: 'shortDescription', rule: 'isDefined' }],
          },
        },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(store.intakeLoading()).toBe(false);
      expect(store.createdIncidentReference()).toBeNull();
      expect(store.intakeError()).toEqual({
        kind: 'api-error',
        code: ErrorCode.VALIDATION_FAILED,
        details: [{ field: 'shortDescription', rule: 'isDefined' }],
        correlationId: null,
      });
    });

    it('settles into a typed INTERNAL_ERROR error on a 500, never silently discarded (AC2)', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);

      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { error: { code: ErrorCode.INTERNAL_ERROR } },
          { status: 500, statusText: 'Internal Server Error' },
        );

      expect(store.intakeLoading()).toBe(false);
      expect(store.intakeError()).toEqual({
        kind: 'api-error',
        code: ErrorCode.INTERNAL_ERROR,
        details: null,
        correlationId: null,
      });
    });

    it('settles into a typed network-error (status 0) when the request never reaches the API', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);

      httpMock.expectOne(INTAKE_URL).error(new ProgressEvent('error'), {
        status: 0,
        statusText: 'Unknown Error',
      });

      expect(store.intakeLoading()).toBe(false);
      expect(store.intakeError()).toEqual({ kind: 'network-error', status: 0 });
    });

    it('ignores a second submit while the first is still in flight, sending exactly one POST (Trap 3)', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);
      store.logIncidentAsRequester(INTAKE_REQUEST);

      // expectOne itself asserts exactly one matching request was made.
      const req = httpMock.expectOne(INTAKE_URL);
      req.flush(
        { reference: 'INC0000001' },
        { status: 201, statusText: 'Created' },
      );

      expect(store.createdIncidentReference()).toBe('INC0000001');
    });

    it('accepts a fresh submit once the previous one has settled (retry after error)', () => {
      store.logIncidentAsRequester(INTAKE_REQUEST);
      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { error: { code: ErrorCode.INTERNAL_ERROR } },
          { status: 500, statusText: 'Internal Server Error' },
        );
      expect(store.intakeError()).not.toBeNull();

      store.logIncidentAsRequester(INTAKE_REQUEST);
      httpMock
        .expectOne(INTAKE_URL)
        .flush(
          { reference: 'INC0000002' },
          { status: 201, statusText: 'Created' },
        );

      expect(store.intakeError()).toBeNull();
      expect(store.createdIncidentReference()).toBe('INC0000002');
    });
  });

  describe('detail — GET /api/incidents/{reference}', () => {
    it('is loading, with no data and no error, while the request is in flight', () => {
      store.loadIncidentByReference('INC0000001');

      expect(store.detailLoading()).toBe(true);
      expect(store.detailError()).toBeNull();
      expect(store.incidentDetail()).toBeNull();

      httpMock.expectOne(detailUrl('INC0000001')).flush(DETAIL_RESPONSE_A);
    });

    it('settles into the persisted data, no loading and no error on success (AC5)', () => {
      store.loadIncidentByReference('INC0000001');
      httpMock.expectOne(detailUrl('INC0000001')).flush(DETAIL_RESPONSE_A);

      expect(store.detailLoading()).toBe(false);
      expect(store.detailError()).toBeNull();
      expect(store.incidentDetail()).toEqual(DETAIL_RESPONSE_A);
    });

    it('settles a 404 into the typed NOT_FOUND error rather than throwing past the caller (AC5)', () => {
      store.loadIncidentByReference('INC9999999');

      expect(() =>
        httpMock
          .expectOne(detailUrl('INC9999999'))
          .flush(
            { error: { code: ErrorCode.NOT_FOUND } },
            { status: 404, statusText: 'Not Found' },
          ),
      ).not.toThrow();

      expect(store.detailLoading()).toBe(false);
      expect(store.incidentDetail()).toBeNull();
      expect(store.detailError()).toEqual({
        kind: 'api-error',
        code: ErrorCode.NOT_FOUND,
        details: null,
        correlationId: null,
      });
    });

    it('settles a 500 into a typed INTERNAL_ERROR error', () => {
      store.loadIncidentByReference('INC0000001');
      httpMock
        .expectOne(detailUrl('INC0000001'))
        .flush(
          { error: { code: ErrorCode.INTERNAL_ERROR } },
          { status: 500, statusText: 'Internal Server Error' },
        );

      expect(store.detailError()).toEqual({
        kind: 'api-error',
        code: ErrorCode.INTERNAL_ERROR,
        details: null,
        correlationId: null,
      });
    });

    it('settles into a typed network-error (status 0) on a connectivity failure', () => {
      store.loadIncidentByReference('INC0000001');
      httpMock
        .expectOne(detailUrl('INC0000001'))
        .error(new ProgressEvent('error'), {
          status: 0,
          statusText: 'Unknown Error',
        });

      expect(store.detailError()).toEqual({ kind: 'network-error', status: 0 });
    });

    it("does not let an earlier reference's late response overwrite a later reference's state (race condition, Trap 3)", () => {
      store.loadIncidentByReference('INC0000001');
      store.loadIncidentByReference('INC0000002');

      const requestA = httpMock.expectOne(detailUrl('INC0000001'));
      const requestB = httpMock.expectOne(detailUrl('INC0000002'));

      // A (the stale request) resolves first; its response must be discarded
      // because B is now the latest request and has not settled yet.
      requestA.flush(DETAIL_RESPONSE_A);

      expect(store.incidentDetail()).toBeNull();
      expect(store.detailLoading()).toBe(true);
      expect(store.detailError()).toBeNull();

      requestB.flush(DETAIL_RESPONSE_B);

      expect(store.incidentDetail()).toEqual(DETAIL_RESPONSE_B);
      expect(store.detailLoading()).toBe(false);
    });

    it("discards a stale request's error the same way it discards a stale success", () => {
      store.loadIncidentByReference('INC0000001');
      store.loadIncidentByReference('INC0000002');

      const requestA = httpMock.expectOne(detailUrl('INC0000001'));
      const requestB = httpMock.expectOne(detailUrl('INC0000002'));

      requestA.flush(
        { error: { code: ErrorCode.NOT_FOUND } },
        { status: 404, statusText: 'Not Found' },
      );

      expect(store.detailError()).toBeNull();
      expect(store.detailLoading()).toBe(true);

      requestB.flush(DETAIL_RESPONSE_B);

      expect(store.incidentDetail()).toEqual(DETAIL_RESPONSE_B);
      expect(store.detailError()).toBeNull();
    });
  });
});
