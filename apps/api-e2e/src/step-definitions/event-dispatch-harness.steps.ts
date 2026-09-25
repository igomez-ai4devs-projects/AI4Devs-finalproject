import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

interface DispatchWithFailingSubscriberResponse {
  correlationId: string;
  healthySubscriberReceivedEvent: boolean;
}

/**
 * Held in a closure rather than an alias, exactly like `harness-smoke.steps.ts`
 * does: this suite has one request and no session to thread through.
 */
let response: Cypress.Response<DispatchWithFailingSubscriberResponse>;

When(
  'the harness dispatches a generic test event with one failing subscriber and one healthy subscriber registered',
  () => {
    // `/api` is the global prefix (`CLAUDE.md` §3); the harness route itself
    // is only reachable because `serve-under-test` boots the API with
    // NODE_ENV=test (`project.json`).
    cy.request({
      method: 'POST',
      url: '/api/test-harness/events/dispatch-with-failing-subscriber',
    }).then((res) => {
      response = res;
    });
  },
);

Then('the harness call succeeds', () => {
  expect(response.status).to.equal(201);
});

Then('the healthy subscriber received the event', () => {
  expect(response.body.healthySubscriberReceivedEvent).to.equal(true);
  expect(response.body.correlationId).to.be.a('string');
  expect(response.body.correlationId.length).to.be.greaterThan(0);
});
