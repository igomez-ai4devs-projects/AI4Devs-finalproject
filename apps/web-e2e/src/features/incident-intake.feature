# Requester intake of an Incident, on the smallest supported viewport and
# operated only by keyboard (T-C1-10, US-C1-01, FR-INC-01, NFR-USE-04, WCAG
# 2.1 AA). The API is simulated with `cy.intercept` in every scenario: a real
# round trip against `apps/api` belongs to the day the detail screen
# (`T-C1-101`) exists to navigate to and prove the reference against.
Feature: Requester intake of an Incident on a 360px, keyboard-only screen (T-C1-10)

  Background:
    Given the viewport is 360px wide
    And the requester visits the intake form

  Scenario: The form fits a 360px screen with no horizontal scrolling
    Then the page requires no horizontal scrolling

  # The component navigates to `/incidents/INC0000001` on success (AC4,
  # `incidentDetailUrl`), but that route is `T-C1-101`'s, not built here — see
  # `incident-routes.ts`'s own doc comment. Angular resolves the whole route
  # tree before touching browser history, so no intermediate URL is ever
  # observable: this scenario asserts what is actually true today, the
  # request the store sent and where the shell's own wildcard settles,
  # without pretending the detail screen exists.
  Scenario: A keyboard-only requester completes and submits the form, which the store sends to the API
    Given the Incident intake API accepts the next submission and assigns reference "INC0000001"
    When the requester fills in the form using only the keyboard and submits it by pressing Enter
    Then the Incident intake request is sent with the completed data
    And the browser settles back on the default route, since T-C1-101's detail screen does not exist yet

  Scenario: A validation failure from the server is shown as an accessible, actionable error summary
    Given the Incident intake API rejects the next submission naming "shortDescription" with rule "maxLength"
    When the requester fills in the form using only the keyboard and submits it by pressing Enter
    Then the error summary is exposed as an alert
    And the error summary links to the "shortDescription" field
