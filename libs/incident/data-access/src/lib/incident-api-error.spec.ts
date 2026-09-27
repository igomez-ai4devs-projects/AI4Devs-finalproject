import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CORRELATION_ID_HEADER, ErrorCode } from '@sport-itsm/shared-contracts';
import { toIncidentApiError } from './incident-api-error';

describe('toIncidentApiError (T-C1-09 Trap 2)', () => {
  it('maps a VALIDATION_FAILED envelope to a typed api-error carrying its field details', () => {
    const httpError = new HttpErrorResponse({
      status: 400,
      error: {
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          details: [{ field: 'shortDescription', rule: 'isDefined' }],
        },
      },
      headers: new HttpHeaders({ [CORRELATION_ID_HEADER]: 'corr-1' }),
    });

    expect(toIncidentApiError(httpError)).toEqual({
      kind: 'api-error',
      code: ErrorCode.VALIDATION_FAILED,
      details: [{ field: 'shortDescription', rule: 'isDefined' }],
      correlationId: 'corr-1',
    });
  });

  it('maps a NOT_FOUND envelope with no details to a typed api-error with details null', () => {
    const httpError = new HttpErrorResponse({
      status: 404,
      error: { error: { code: ErrorCode.NOT_FOUND } },
    });

    expect(toIncidentApiError(httpError)).toEqual({
      kind: 'api-error',
      code: ErrorCode.NOT_FOUND,
      details: null,
      correlationId: null,
    });
  });

  it('maps an INTERNAL_ERROR envelope (500) to a typed api-error', () => {
    const httpError = new HttpErrorResponse({
      status: 500,
      error: { error: { code: ErrorCode.INTERNAL_ERROR } },
    });

    expect(toIncidentApiError(httpError)).toEqual({
      kind: 'api-error',
      code: ErrorCode.INTERNAL_ERROR,
      details: null,
      correlationId: null,
    });
  });

  it('maps a status-0 failure with no response body to a network-error, never a guessed code', () => {
    const httpError = new HttpErrorResponse({
      status: 0,
      error: new ProgressEvent('error'),
    });

    expect(toIncidentApiError(httpError)).toEqual({
      kind: 'network-error',
      status: 0,
    });
  });

  it('maps a response body that is not an ErrorEnvelope to a network-error', () => {
    const httpError = new HttpErrorResponse({
      status: 502,
      error: '<html>Bad Gateway</html>',
    });

    expect(toIncidentApiError(httpError)).toEqual({
      kind: 'network-error',
      status: 502,
    });
  });

  it('treats an unrecognized code string as a network-error rather than trusting an unknown code', () => {
    const httpError = new HttpErrorResponse({
      status: 409,
      error: { error: { code: 'CONFLICT' } },
    });

    expect(toIncidentApiError(httpError)).toEqual({
      kind: 'network-error',
      status: 409,
    });
  });
});
