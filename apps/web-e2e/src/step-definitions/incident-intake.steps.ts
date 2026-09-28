import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import type { IncidentDetailResponse } from '@sport-itsm/shared-contracts';

const INTAKE_URL = '**/api/incidents';

function detailUrlPattern(reference: string): string {
  return `**/api/incidents/${reference}`;
}

/**
 * A stand-in "persisted state" for the detail intercepts below (T-C1-101).
 * `originChannel` and `loggedAt` are the two values that prove the point
 * these scenarios exist to prove — the requester never typed either one
 * into the intake form (`incident-intake-form.component.ts`'s own doc
 * comment: no field for it exists at all), so the detail screen showing them
 * demonstrates it renders the server's own response, not an echo of the
 * form. `reference` is overridden per call so the same fixture serves every
 * scenario without a second reference ever colliding with the first.
 */
function persistedReportBody(reference: string): IncidentDetailResponse {
  return {
    reference,
    loggedAt: '2026-01-15T08:30:00.000Z',
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
}

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

// --- T-C1-101: the detail screen ------------------------------------------

Given(
  'the Incident detail API returns a persisted report for reference {string}',
  (reference: string) => {
    cy.intercept('GET', detailUrlPattern(reference), {
      statusCode: 200,
      body: persistedReportBody(reference),
    }).as(`getIncident-${reference}`);
  },
);

Given(
  'the Incident detail API reports no Incident for reference {string}',
  (reference: string) => {
    cy.intercept('GET', detailUrlPattern(reference), {
      statusCode: 404,
      body: { error: { code: 'NOT_FOUND' } },
    });
  },
);

Given(
  'the Incident detail API rejects reference {string} as malformed',
  (reference: string) => {
    cy.intercept('GET', detailUrlPattern(reference), {
      statusCode: 400,
      body: {
        error: {
          code: 'VALIDATION_FAILED',
          details: [{ field: 'reference', rule: 'matches' }],
        },
      },
    });
  },
);

Given(
  'the Incident detail API is unreachable for reference {string}',
  (reference: string) => {
    cy.intercept('GET', detailUrlPattern(reference), {
      forceNetworkError: true,
    });
  },
);

When(
  'the requester visits the detail page for reference {string}',
  (reference: string) => {
    cy.visit(`/incidents/${reference}`);
  },
);

Then(
  'the browser lands on the detail page for reference {string}',
  (reference: string) => {
    cy.location('pathname').should('equal', `/incidents/${reference}`);
  },
);

Then(
  'the detail page shows the persisted report, not the values just typed',
  () => {
    cy.get('.incident-detail__fields').should('be.visible');
    // Neither field the requester typed into the intake form carries an
    // `originChannel` — it is server-assigned. Its presence on screen is
    // this scenario's own proof that the detail screen renders the
    // response, not an echo of what was submitted (AC1).
    cy.contains('.incident-detail__fields', 'Formulario web').should(
      'be.visible',
    );
  },
);

Then('the detail page shows a not-found message', () => {
  cy.get('.incident-detail__outcome').should(
    'contain.text',
    'No hemos encontrado ningún aviso',
  );
});

Then('the detail page shows an invalid-reference message', () => {
  cy.get('.incident-detail__outcome').should(
    'contain.text',
    'no tiene el formato correcto',
  );
});

Then('the detail page shows a network-error message', () => {
  cy.get('.incident-detail__outcome').should(
    'contain.text',
    'No hemos podido conectar con el servidor',
  );
});

/**
 * Simulates an in-app SPA navigation from one detail reference to another
 * (T-C1-101 Trap 2's "router reuses the component instance" path) without a
 * full page reload. `cy.visit()` cannot do this — it always boots a fresh
 * application. There is no in-app link this delivery slice renders between
 * two reports (out of scope), so the only available trigger is the same one
 * a `routerLink` ultimately relies on: a `pushState` followed by the
 * `popstate` event Angular's `PathLocationStrategy` listens for.
 */
When(
  'the requester navigates in-app to the detail page for reference {string}',
  (reference: string) => {
    cy.window().then((win) => {
      win.history.pushState({}, '', `/incidents/${reference}`);
      win.dispatchEvent(new win.PopStateEvent('popstate'));
    });
  },
);

Then(
  'the detail page never shows reference {string} again',
  (reference: string) => {
    cy.get('body').should('not.contain.text', reference);
  },
);

Then('the detail page shows reference {string}', (reference: string) => {
  cy.get('.incident-detail__fields').should('contain.text', reference);
});
