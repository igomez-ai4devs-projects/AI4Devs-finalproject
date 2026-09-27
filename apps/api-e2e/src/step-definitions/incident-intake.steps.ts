import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

interface ValidationErrorDetail {
  field: string;
  rule: string;
}

interface IncidentIntakeResponseBody {
  reference?: string;
  error?: {
    code: string;
    details?: ValidationErrorDetail[];
  };
}

/**
 * Held in closures, the same shape `harness-smoke.steps.ts` and
 * `event-dispatch-harness.steps.ts` already use: one scenario at a time, no
 * session to thread through `cy.wrap`/aliases.
 */
let requestBody: Record<string, unknown>;
let lastResponse: Cypress.Response<IncidentIntakeResponseBody>;
let baselineSequence: number | null = null;

/** A body `LogIncidentRequesterDto` accepts outright — no priority-bearing field, no `originChannel`. */
function freshValidBody(): Record<string, unknown> {
  return {
    shortDescription: 'Cannot submit match roster',
    description:
      'The roster submission form rejects a valid squad list with no error message.',
  };
}

/** `INC0000123` -> `123` — the sequence value `IncidentReferencePolicy` formatted in. */
function referenceToSequence(reference: string): number {
  return Number.parseInt(reference.slice(3), 10);
}

/** A plausible value for each of the four fields `US-C1-01` forbids a requester from setting. */
function forbiddenFieldValue(field: string): unknown {
  return field === 'competitionAffectsInProgress' ? true : 'HIGH';
}

function postIncidentIntake(
  body: Record<string, unknown>,
): Cypress.Chainable<Cypress.Response<IncidentIntakeResponseBody>> {
  // `/api` is the global prefix (`CLAUDE.md` §3). `failOnStatusCode: false`
  // because this suite asserts on 400/403/500 bodies as much as on 201 ones.
  return cy.request({
    method: 'POST',
    url: '/api/incidents',
    body,
    failOnStatusCode: false,
  });
}

Given('a baseline Incident has just been logged', () => {
  postIncidentIntake(freshValidBody()).then((res) => {
    expect(res.status, 'baseline Incident must be accepted').to.equal(201);
    baselineSequence = referenceToSequence(res.body.reference as string);
  });
});

Given('a fresh Incident intake request body', () => {
  requestBody = freshValidBody();
});

Given('the request body also carries a {string} property', (field: string) => {
  requestBody = { ...requestBody, [field]: forbiddenFieldValue(field) };
});

Given('the request body has no {string} property', (field: string) => {
  const rest = { ...requestBody };
  delete rest[field];
  requestBody = rest;
});

When('the requester posts the Incident intake request', () => {
  postIncidentIntake(requestBody).then((res) => {
    lastResponse = res;
  });
});

Then(
  'the response is a validation failure naming {string}',
  (field: string) => {
    expect(lastResponse.status).to.equal(400);
    expect(lastResponse.body.error?.code).to.equal('VALIDATION_FAILED');
    const fields = (lastResponse.body.error?.details ?? []).map(
      (detail) => detail.field,
    );
    expect(fields, JSON.stringify(lastResponse.body)).to.include(field);
  },
);

Then('no Incident was created since the baseline', () => {
  expect(baselineSequence, 'baseline must have been captured first').to.be.a(
    'number',
  );

  postIncidentIntake(freshValidBody()).then((res) => {
    expect(
      res.status,
      'the next valid Incident must still be accepted',
    ).to.equal(201);
    const nextSequence = referenceToSequence(res.body.reference as string);
    // If the rejected request had reached the aggregate, this would be
    // `baselineSequence + 2` (one burned reference for the rejected call,
    // one for this confirmation call) instead of `+ 1`.
    expect(nextSequence).to.equal((baselineSequence as number) + 1);
  });
});

Then(
  'the response is 201 with a reference shaped like {string} plus 7 digits',
  (prefix: string) => {
    expect(lastResponse.status).to.equal(201);
    expect(lastResponse.body.reference).to.match(
      new RegExp(`^${prefix}[0-9]{7}$`),
    );
  },
);

Then('the response body carries no field the requester may not see', () => {
  expect(Object.keys(lastResponse.body)).to.deep.equal(['reference']);
});
