import { ArgumentsHost, Logger, NotFoundException } from '@nestjs/common';
import {
  IncidentDescriptionRequiredError,
  IncidentShortDescriptionTooLongError,
} from '@sport-itsm/incident-domain';
import { IncidentLogAuthorizationError } from '@sport-itsm/incident-application';
import { GlobalExceptionFilter } from './global-exception.filter';
import { RequestValidationException } from './request-validation.exception';

const VALID_CORRELATION_ID = '0192f3a4-5b6c-4d8e-8f90-123456789abc';

function fakeHost(headers: Record<string, string | undefined> = {}): {
  host: ArgumentsHost;
  response: {
    statusCode?: number;
    headers: Record<string, string>;
    body?: unknown;
  };
} {
  const response: {
    statusCode?: number;
    headers: Record<string, string>;
    body?: unknown;
  } = { headers: {} };

  const responseApi = {
    status(statusCode: number) {
      response.statusCode = statusCode;
      return responseApi;
    },
    setHeader(name: string, value: string) {
      response.headers[name] = value;
      return responseApi;
    },
    json(body: unknown) {
      response.body = body;
    },
  };

  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
      getResponse: () => responseApi,
    }),
  } as unknown as ArgumentsHost;

  return { host, response };
}

describe('GlobalExceptionFilter (T-C1-08 Trap 3 — the minimum owed here, not T-C10-40)', () => {
  it('maps RequestValidationException to 400 VALIDATION_FAILED with the DTO’s own details', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost();
    const exception = new RequestValidationException([
      { field: 'shortDescription', rule: 'isNotBlank' },
    ]);

    filter.catch(exception, host);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_FAILED',
        details: [{ field: 'shortDescription', rule: 'isNotBlank' }],
      },
    });
  });

  it('maps IncidentLogAuthorizationError to 403 FORBIDDEN', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost();
    const exception = new IncidentLogAuthorizationError(
      'LogIncident',
      'actor-1',
    );

    filter.catch(exception, host);

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ error: { code: 'FORBIDDEN' } });
  });

  it('maps an Incident.log() domain error to 400 VALIDATION_FAILED naming its field', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost();
    const exception = new IncidentShortDescriptionTooLongError('a'.repeat(256));

    filter.catch(exception, host);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_FAILED',
        details: [{ field: 'shortDescription', rule: 'maxLength' }],
      },
    });
  });

  it('maps a different Incident.log() domain error to its own field (description)', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost();
    const exception = new IncidentDescriptionRequiredError('');

    filter.catch(exception, host);

    expect(response.body).toEqual({
      error: {
        code: 'VALIDATION_FAILED',
        details: [{ field: 'description', rule: 'isNotBlank' }],
      },
    });
  });

  it('maps the framework’s own NotFoundException (unmatched route) to 404 NOT_FOUND, not 500 — regression guard for harness-smoke.feature', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost();

    filter.catch(new NotFoundException(), host);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: { code: 'NOT_FOUND' } });
  });

  it('maps any other error to 500 INTERNAL_ERROR without leaking a stack or the internal message (verification #5)', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost();
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const exception = new Error(
      'connection to postgres refused at 10.0.0.5:5432',
    );

    filter.catch(exception, host);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: { code: 'INTERNAL_ERROR' } });
    const serialized = JSON.stringify(response.body);
    expect(serialized).not.toContain('postgres');
    expect(serialized).not.toContain('stack');
  });

  it('logs the unhandled error and its correlationId, never the response body (verification #5)', () => {
    const filter = new GlobalExceptionFilter();
    const { host } = fakeHost({
      'x-correlation-id': VALID_CORRELATION_ID,
    });
    const logSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);

    filter.catch(new Error('boom'), host);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(VALID_CORRELATION_ID),
      expect.any(String),
    );
  });

  it('echoes a valid inbound correlation id on the response header', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost({
      'x-correlation-id': VALID_CORRELATION_ID,
    });

    filter.catch(new IncidentLogAuthorizationError('LogIncident', 'x'), host);

    expect(response.headers['X-Correlation-Id']).toBe(VALID_CORRELATION_ID);
  });

  it('mints a correlation id when the header is absent or malformed', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = fakeHost({ 'x-correlation-id': 'not-a-uuid' });

    filter.catch(new IncidentLogAuthorizationError('LogIncident', 'x'), host);

    expect(response.headers['X-Correlation-Id']).toBeDefined();
    expect(response.headers['X-Correlation-Id']).not.toBe('not-a-uuid');
  });
});
