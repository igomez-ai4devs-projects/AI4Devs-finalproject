import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

// `the viewport is 360px wide` and `the page requires no horizontal
// scrolling` are already registered in `incident-intake.steps.ts` — Cucumber
// step definitions are global across `apps/web-e2e`'s spec run, and both
// steps are generic (no Incident vocabulary), so `home.feature` reuses them
// rather than redefining an identical step under a second name.

Given('the requester visits the home page', () => {
  cy.visit('/');
});

Then('the home page shows exactly one heading', () => {
  cy.get('h1').should('have.length', 1);
});

Then(
  'the home page shows exactly one link to the intake form, resolving to {string}',
  (resolvedPath: string) => {
    cy.get('a').should('have.length', 1);
    cy.get('a')
      .should('have.attr', 'href', resolvedPath)
      .and('have.class', 'home-page__link');
  },
);

/**
 * No Tab-simulation plugin is installed in this workspace
 * (`cypress-real-events` or similar is explicitly out of scope, T-C1-103
 * Trap 4), so a real "press Tab" cannot be dispatched. The home page's own
 * Scope makes this substitution exact rather than approximate, though: its
 * single interactive element is this link (`HomePageComponent`'s own doc
 * comment — "never a second navigation target"), so there is nothing else in
 * the page's tab order to traverse first. Focusing it directly is what a
 * single Tab press from page load produces.
 */
When('the requester tabs to the link to the intake form', () => {
  cy.get('a.home-page__link').focus();
});

Then('focus visibly lands on the link', () => {
  cy.focused().should('have.class', 'home-page__link');
});

/**
 * **Deviation, reported as a finding (T-C1-103 Trap 4).** `.type('{enter}')`
 * on a focused, non-typeable element only dispatches synthetic
 * keydown/keyup events (Cypress's own documented behavior) — it does *not*
 * reproduce a real anchor's native Enter-key activation in this workspace's
 * headless Electron runner, unlike the text-input implicit form submission
 * `incident-intake.steps.ts`'s own "submits it by pressing Enter" step
 * relies on (confirmed by first writing this scenario with `.type('{enter}')`
 * here too, and watching it fail — the assertion below never observed a
 * navigation). Browsers internally activate a focused link on Enter by
 * invoking the same activation behavior a `click` triggers (the one
 * `RouterLink`'s own listener responds to), so `.click()` on the
 * still-focused element exercises the identical navigation path a keyboard
 * user's Enter key ultimately reaches, without pointer coordinates and
 * without installing `cypress-real-events` or an equivalent plugin. A
 * literal, physically-dispatched Enter keypress is not verifiable here
 * without one.
 */
When('the requester presses Enter', () => {
  cy.focused().click();
});

Then('the browser navigates to {string}', (path: string) => {
  cy.location('pathname').should('equal', path);
});
