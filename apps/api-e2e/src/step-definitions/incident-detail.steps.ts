import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { lastCreatedIncidentReference } from './incident-intake.steps';

interface ValidationErrorDetail {
  field: string;
  rule: string;
}

interface IncidentDetailResponseBody {
  reference?: string;
  loggedAt?: string;
  originChannel?: string;
  shortDescription?: string;
  description?: string;
  affectedServiceId?: string | null;
  categoryId?: string | null;
  impact?: number | null;
  urgency?: number | null;
  priority?: string | null;
  competitionAffectsInProgress?: boolean;
  error?: {
    code: string;
    details?: ValidationErrorDetail[];
  };
}

/** Held in a closure, the same shape every other step file in this suite uses. */
let lastResponse: Cypress.Response<IncidentDetailResponseBody>;

function getIncidentByReference(
  reference: string,
): Cypress.Chainable<Cypress.Response<IncidentDetailResponseBody>> {
  // `/api` is the global prefix (`CLAUDE.md` §3). `failOnStatusCode: false`
  // because this suite asserts on 404/400 bodies as much as on 200 ones.
  return cy.request({
    method: 'GET',
    url: `/api/incidents/${reference}`,
    failOnStatusCode: false,
  });
}

When('the requester gets the Incident by the reference just created', () => {
  getIncidentByReference(lastCreatedIncidentReference()).then((res) => {
    lastResponse = res;
  });
});

When(
  'the requester gets an Incident by the reference {string}',
  (reference: string) => {
    getIncidentByReference(reference).then((res) => {
      lastResponse = res;
    });
  },
);

Then('the GET response is 200 with the persisted Incident state', () => {
  expect(lastResponse.status, JSON.stringify(lastResponse.body)).to.equal(200);
  // Compares against what `freshValidBody()` (`incident-intake.steps.ts`)
  // actually sent, and against the fields only the server ever sets
  // (AC1: "compare with what was sent where applicable, and check
  // server-only fields: originChannel: portal, logged-at instant, empty
  // assessment fields").
  expect(lastResponse.body.reference).to.match(/^INC[0-9]{7}$/);
  expect(lastResponse.body.shortDescription).to.equal(
    'Cannot submit match roster',
  );
  expect(lastResponse.body.description).to.equal(
    'The roster submission form rejects a valid squad list with no error message.',
  );
  expect(lastResponse.body.originChannel).to.equal('portal');
  expect(lastResponse.body.loggedAt).to.match(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  );
  expect(lastResponse.body.affectedServiceId).to.equal(null);
  expect(lastResponse.body.categoryId).to.equal(null);
  expect(lastResponse.body.impact).to.equal(null);
  expect(lastResponse.body.urgency).to.equal(null);
  expect(lastResponse.body.priority).to.equal(null);
  expect(lastResponse.body.competitionAffectsInProgress).to.equal(false);
});

Then('the GET response body carries no internal identifier', () => {
  expect(lastResponse.body).not.to.have.property('id');
  expect(lastResponse.body).not.to.have.property('reporterId');
  expect(lastResponse.body).not.to.have.property('loggedBy');
});

Then('the GET response is a 404 with error code {string}', (code: string) => {
  expect(lastResponse.status).to.equal(404);
  expect(lastResponse.body.error?.code).to.equal(code);
});

Then(
  'the GET response is a validation failure with exactly one detail for {string}, rule {string}',
  (field: string, rule: string) => {
    expect(lastResponse.status).to.equal(400);
    expect(lastResponse.body.error?.code).to.equal('VALIDATION_FAILED');
    const details = (lastResponse.body.error?.details ?? []).filter(
      (detail) => detail.field === field,
    );
    // Exactly one detail: `@IsDefined()` always runs first and `@Matches()`
    // is the only other decorator on `reference`
    // (`get-incident-by-reference-params.dto.ts`'s own doc comment), so no
    // cascade is possible even without `stopAtFirstError` doing any real
    // work here.
    expect(details, JSON.stringify(lastResponse.body)).to.have.length(1);
    expect(details[0].rule).to.equal(rule);
  },
);
