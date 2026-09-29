# Requester intake of an Incident, on the smallest supported viewport and
# operated only by keyboard (T-C1-10, US-C1-01, FR-INC-01, NFR-USE-04, WCAG
# 2.1 AA), and the detail screen it redirects to once the report is persisted
# (T-C1-101). The API is simulated with `cy.intercept` in every scenario
# except the one AC1 real-server proof (`incident-detail.feature` does not
# exist as a separate file: this slice's end-to-end story is one Feature, one
# flow — intake, then see what was persisted).
Feature: Requester intake of an Incident on a 360px, keyboard-only screen (T-C1-10, T-C1-101)

  Background:
    Given the viewport is 360px wide
    And the requester visits the intake form

  Scenario: The form fits a 360px screen with no horizontal scrolling
    Then the page requires no horizontal scrolling

  # `T-C1-101`'s detail route now exists, so a successful submission's
  # redirect (`incidentDetailUrl`, AC4) actually resolves — this scenario
  # asserts the full slice end to end: the request the store sent, the URL
  # the browser lands on, and the persisted state the detail screen renders.
  Scenario: A keyboard-only requester completes and submits the form, then sees the persisted report
    Given the Incident intake API accepts the next submission and assigns reference "INC0000001"
    And the Incident detail API returns a persisted report for reference "INC0000001"
    When the requester fills in the form using only the keyboard and submits it by pressing Enter
    Then the Incident intake request is sent with the completed data
    And the browser lands on the detail page for reference "INC0000001"
    And the detail page shows the persisted report, not the values just typed

  Scenario: A validation failure from the server is shown as an accessible, actionable error summary
    Given the Incident intake API rejects the next submission naming "shortDescription" with rule "maxLength"
    When the requester fills in the form using only the keyboard and submits it by pressing Enter
    Then the error summary is exposed as an alert
    And the error summary links to the "shortDescription" field

  # T-C1-101's own acceptance criteria: every state the detail screen can be
  # in, driven directly (visiting `/incidents/<reference>`) rather than via
  # the intake form, since a requester can also reach this URL from a link,
  # bookmark or shared reference.
  Scenario: Visiting a reference with no matching Incident shows an explicit not-found state
    Given the Incident detail API reports no Incident for reference "INC9999999"
    When the requester visits the detail page for reference "INC9999999"
    Then the detail page shows a not-found message

  Scenario: Visiting a malformed reference shows a distinct, more actionable message than not-found
    Given the Incident detail API rejects reference "not-a-real-reference" as malformed
    When the requester visits the detail page for reference "not-a-real-reference"
    Then the detail page shows an invalid-reference message

  Scenario: A network failure while loading the detail page is shown, never silently
    Given the Incident detail API is unreachable for reference "INC0000001"
    When the requester visits the detail page for reference "INC0000001"
    Then the detail page shows a network-error message

  # The router reuses this component instance across a same-route-config
  # navigation (one `:reference` to another) instead of destroying it
  # (T-C1-101 Trap 2) — simulated here via the browser's own History API
  # since this delivery slice adds no in-app link between two reports.
  Scenario: Navigating from one report directly to another never flashes the previous report
    Given the Incident detail API returns a persisted report for reference "INC0000001"
    And the Incident detail API returns a persisted report for reference "INC0000002"
    When the requester visits the detail page for reference "INC0000001"
    And the detail page shows the persisted report, not the values just typed
    And the requester navigates in-app to the detail page for reference "INC0000002"
    Then the detail page never shows reference "INC0000001" again
    And the detail page shows reference "INC0000002"
