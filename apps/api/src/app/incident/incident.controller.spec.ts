import { NotFoundException } from '@nestjs/common';
import { Identity, TicketReference } from '@sport-itsm/shared-domain';
import {
  GetIncidentByReferenceUseCase,
  IncidentActor,
  LogIncidentUseCase,
} from '@sport-itsm/incident-application';
import { OriginChannel } from '@sport-itsm/incident-domain';
import { IncidentController } from './incident.controller';
import { IncidentActorResolver } from './incident-actor-resolver';
import { GetIncidentByReferenceParamsDto } from './dto/get-incident-by-reference-params.dto';
import { LogIncidentRequesterDto } from './dto/log-incident-requester.dto';

const ACTOR: IncidentActor = {
  identity: Identity.fromString('0192f3a4-5b6c-7d8e-8f90-123456789abc'),
  canLogIncidentAsRequester: () => true,
};
const REFERENCE = TicketReference.fromString('INC0000042');
const ALLOCATED_ID = Identity.fromString(
  '0192f3a4-5b6c-7d8e-8f90-123456789abd',
);

function buildController(): {
  controller: IncidentController;
  execute: jest.Mock;
  getByReferenceExecute: jest.Mock;
  resolveActor: jest.Mock;
} {
  const execute = jest
    .fn()
    .mockResolvedValue({ id: ALLOCATED_ID, reference: REFERENCE });
  const getByReferenceExecute = jest.fn();
  const resolveActor = jest.fn().mockResolvedValue(ACTOR);
  const useCase = { execute } as unknown as LogIncidentUseCase;
  const getByReferenceUseCase = {
    execute: getByReferenceExecute,
  } as unknown as GetIncidentByReferenceUseCase;
  const actorResolver: IncidentActorResolver = { resolveActor };

  return {
    controller: new IncidentController(
      useCase,
      getByReferenceUseCase,
      actorResolver,
    ),
    execute,
    getByReferenceExecute,
    resolveActor,
  };
}

function fakeResponse(): {
  setHeader: jest.Mock;
  headers: Record<string, string>;
} {
  const headers: Record<string, string> = {};
  const setHeader = jest.fn((name: string, value: string) => {
    headers[name] = value;
  });
  return { setHeader, headers };
}

function requesterDto(
  overrides: Partial<LogIncidentRequesterDto> = {},
): LogIncidentRequesterDto {
  return Object.assign(new LogIncidentRequesterDto(), {
    shortDescription: 'Cannot submit match roster',
    description:
      'The roster submission form rejects a valid squad list with no error message.',
    ...overrides,
  });
}

describe('IncidentController (T-C1-08)', () => {
  it('hardcodes originChannel to "portal" regardless of the DTO — the client never chooses it (FR-OMN-02)', async () => {
    const { controller, execute } = buildController();
    const res = fakeResponse();

    await controller.logIncidentAsRequester(requesterDto(), undefined, res);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({ originChannel: 'portal' }),
      expect.anything(),
    );
  });

  it('resolves the actor via INCIDENT_ACTOR_RESOLVER and passes it as the execution context', async () => {
    const { controller, execute, resolveActor } = buildController();
    const res = fakeResponse();

    await controller.logIncidentAsRequester(
      requesterDto(),
      '0192f3a4-5b6c-4d8e-8f90-123456789abc',
      res,
    );

    expect(resolveActor).toHaveBeenCalled();
    expect(execute).toHaveBeenCalledWith(expect.anything(), {
      actor: ACTOR,
      correlationId: '0192f3a4-5b6c-4d8e-8f90-123456789abc',
    });
  });

  it('mints a correlationId when the header is absent, and echoes it on the response header', async () => {
    const { controller } = buildController();
    const res = fakeResponse();

    await controller.logIncidentAsRequester(requesterDto(), undefined, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      'X-Correlation-Id',
      expect.any(String),
    );
    expect(res.headers['X-Correlation-Id']).toHaveLength(36);
  });

  it('echoes a valid inbound correlationId unchanged', async () => {
    const { controller } = buildController();
    const res = fakeResponse();
    const inboundId = '0192f3a4-5b6c-4d8e-8f90-123456789abc';

    await controller.logIncidentAsRequester(requesterDto(), inboundId, res);

    expect(res.headers['X-Correlation-Id']).toBe(inboundId);
  });

  it('mints a fresh correlationId when the header is malformed rather than passing it through', async () => {
    const { controller, execute } = buildController();
    const res = fakeResponse();

    await controller.logIncidentAsRequester(requesterDto(), 'not-a-uuid', res);

    expect(res.headers['X-Correlation-Id']).not.toBe('not-a-uuid');
    expect(execute).toHaveBeenCalledWith(expect.anything(), {
      actor: ACTOR,
      correlationId: res.headers['X-Correlation-Id'],
    });
  });

  it('maps the use-case result to only the reference the requester may see (AC3) — no internal id', async () => {
    const { controller } = buildController();
    const res = fakeResponse();

    const result = await controller.logIncidentAsRequester(
      requesterDto(),
      undefined,
      res,
    );

    expect(result).toEqual({ reference: 'INC0000042' });
  });

  it('forwards the DTO’s optional affectedServiceId untouched', async () => {
    const { controller, execute } = buildController();
    const res = fakeResponse();
    const dto = requesterDto({
      affectedServiceId: '0192f3a4-5b6c-7d8e-8f90-123456789abe',
    });

    await controller.logIncidentAsRequester(dto, undefined, res);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        affectedServiceId: '0192f3a4-5b6c-7d8e-8f90-123456789abe',
      }),
      expect.anything(),
    );
  });
});

describe('IncidentController.getIncidentByReference (T-C1-100)', () => {
  const SNAPSHOT = {
    id: ALLOCATED_ID,
    reference: REFERENCE,
    loggedAtEpochMs: Date.parse('2026-09-26T09:00:00.000Z'),
    loggedBy: ACTOR.identity,
    reporterId: ACTOR.identity,
    originChannel: OriginChannel.fromCode('portal'),
    shortDescription: 'Cannot submit match roster',
    description:
      'The roster submission form rejects a valid squad list with no error message.',
    affectedServiceId: null,
    categoryId: null,
    impact: null,
    urgency: null,
    priority: null,
    competitionAffectsInProgress: false,
    affectedSubject: null,
    assignment: null,
  };

  function paramsDto(reference: string): GetIncidentByReferenceParamsDto {
    return Object.assign(new GetIncidentByReferenceParamsDto(), {
      reference,
    });
  }

  it('constructs a TicketReference from the already-validated param and calls the use case with it', async () => {
    const { controller, getByReferenceExecute } = buildController();
    getByReferenceExecute.mockResolvedValue({ ok: true, value: SNAPSHOT });
    const res = fakeResponse();

    await controller.getIncidentByReference(
      paramsDto('INC0000042'),
      undefined,
      res,
    );

    expect(getByReferenceExecute).toHaveBeenCalledTimes(1);
    const calledWith = getByReferenceExecute.mock
      .calls[0][0] as TicketReference;
    expect(calledWith.value).toBe('INC0000042');
  });

  it('on the ok branch, maps the snapshot to IncidentDetailResponse and returns it (never the id)', async () => {
    const { controller, getByReferenceExecute } = buildController();
    getByReferenceExecute.mockResolvedValue({ ok: true, value: SNAPSHOT });
    const res = fakeResponse();

    const result = await controller.getIncidentByReference(
      paramsDto('INC0000042'),
      undefined,
      res,
    );

    expect(result).toEqual({
      reference: 'INC0000042',
      loggedAt: '2026-09-26T09:00:00.000Z',
      originChannel: 'portal',
      shortDescription: 'Cannot submit match roster',
      description:
        'The roster submission form rejects a valid squad list with no error message.',
      affectedServiceId: null,
      categoryId: null,
      impact: null,
      urgency: null,
      priority: null,
      competitionAffectsInProgress: false,
    });
    expect(result).not.toHaveProperty('id');
  });

  it('on the err branch (INCIDENT_NOT_FOUND), throws NotFoundException — GlobalExceptionFilter maps it to 404', async () => {
    const { controller, getByReferenceExecute } = buildController();
    getByReferenceExecute.mockResolvedValue({
      ok: false,
      error: { reason: 'INCIDENT_NOT_FOUND', reference: REFERENCE },
    });
    const res = fakeResponse();

    await expect(
      controller.getIncidentByReference(
        paramsDto('INC0000042'),
        undefined,
        res,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('resolves and echoes the correlation id the same way the POST route does', async () => {
    const { controller, getByReferenceExecute } = buildController();
    getByReferenceExecute.mockResolvedValue({ ok: true, value: SNAPSHOT });
    const res = fakeResponse();
    const inboundId = '0192f3a4-5b6c-4d8e-8f90-123456789abc';

    await controller.getIncidentByReference(
      paramsDto('INC0000042'),
      inboundId,
      res,
    );

    expect(res.headers['X-Correlation-Id']).toBe(inboundId);
  });
});
