import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const INTAKE_URL = '**/api/incidents';

Given('the viewport is 360px wide', () => {
  // 360px is the narrowest viewport `T-C1-10` AC2 requires this form to fit
  // without horizontal scrolling — a common small-phone width.
  cy.viewport(360, 800);
});

Given('the requester visits the intake form', () => {
  cy.visit('/incidents/new');
});

Given(
  'the Incident intake API accepts the next submission and assigns reference {string}',
  (reference: string) => {
    cy.intercept('POST', INTAKE_URL, {
      statusCode: 201,
      body: { reference },
    }).as('logIncident');
  },
);

Given(
  'the Incident intake API rejects the next submission naming {string} with rule {string}',
  (field: string, rule: string) => {
    cy.intercept('POST', INTAKE_URL, {
      statusCode: 400,
      body: {
        error: {
          code: 'VALIDATION_FAILED',
          details: [{ field, rule }],
        },
      },
    }).as('logIncident');
  },
);

Then('the page requires no horizontal scrolling', () => {
  cy.document().then((doc) => {
    const root = doc.documentElement;
    expect(root.scrollWidth).to.be.at.most(root.clientWidth);
  });
});

/**
 * Every interaction below is achieved without a single mouse click.
 * `.type()` focuses its target through the DOM `focus()` method, not a
 * simulated pointer click, and the final Enter keypress inside the
 * single-line `shortDescription` `<input>` triggers the browser's own
 * implicit form submission — the same mechanism a keyboard-only requester
 * would use, with no dependency on a Tab-key-simulation plugin this
 * workspace does not install (`sport-itsm-frontend`: no dependency
 * additions outside an approved change).
 */
When(
  'the requester fills in the form using only the keyboard and submits it by pressing Enter',
  () => {
    cy.get('#incident-description').type(
      'The roster submission form times out for every team.',
    );
    cy.get('#incident-short-description').type(
      'Cannot submit match roster{enter}',
    );
  },
);

Then('the Incident intake request is sent with the completed data', () => {
  cy.wait('@logIncident').its('request.body').should('deep.equal', {
    shortDescription: 'Cannot submit match roster',
    description: 'The roster submission form times out for every team.',
  });
});

Then(
  "the browser settles back on the default route, since T-C1-101's detail screen does not exist yet",
  () => {
    cy.location('pathname').should('equal', '/');
  },
);

Then('the error summary is exposed as an alert', () => {
  cy.wait('@logIncident');
  cy.get('[role="alert"].incident-intake__error-summary').should('be.visible');
});

Then('the error summary links to the {string} field', (field: string) => {
  cy.get('[role="alert"].incident-intake__error-summary a')
    .should('have.attr', 'href')
    .and(
      'include',
      field === 'shortDescription' ? 'incident-short-description' : field,
    );
});
