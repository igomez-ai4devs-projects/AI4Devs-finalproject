# The web surface's home page at `/` (T-C1-103) — the Render demo's own
# landing page, in Spanish, with a single link to the requester intake form.
# `harness-smoke.feature` already covers the shell's own structure around
# this routed child (the `main` landmark, the router settling on `/`); this
# feature covers what actually renders inside it.
Feature: The home page at / links to the Incident intake form

  Background:
    Given the viewport is 360px wide
    And the requester visits the home page

  Scenario: The home page fits a 360px screen with no horizontal scrolling
    Then the page requires no horizontal scrolling

  Scenario: The home page presents a single heading and a single link to the intake form
    Then the home page shows exactly one heading
    And the home page shows exactly one link to the intake form, resolving to "/incidents/new"

  Scenario: A keyboard-only visitor tabs to the link and activates it with Enter
    When the requester tabs to the link to the intake form
    Then focus visibly lands on the link
    When the requester presses Enter
    Then the browser navigates to "/incidents/new"
