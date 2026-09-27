# T-C1-100 — GET /incidents/{reference}, the "see it" half of the slice
# T-C1-08's POST starts, over real HTTP against the ephemeral E2E database
# (apps/api-e2e's own e2e-db-up/e2e-migrate targets), with no mocked
# repository or use case anywhere in this run.
Feature: Reading a single Incident by its reference (T-C1-100, US-C1-01, FR-INC-01)

  Scenario: A freshly logged Incident is readable by its own reference, with the persisted state
    Given a fresh Incident intake request body
    When the requester posts the Incident intake request
    And the requester gets the Incident by the reference just created
    Then the GET response is 200 with the persisted Incident state
    And the GET response body carries no internal identifier

  Scenario: A syntactically valid reference that matches no Incident answers 404 NOT_FOUND
    When the requester gets an Incident by the reference "INC9999999"
    Then the GET response is a 404 with error code "NOT_FOUND"

  Scenario: A syntactically valid but foreign-record-type reference also answers 404, not 400
    When the requester gets an Incident by the reference "SRQ0000001"
    Then the GET response is a 404 with error code "NOT_FOUND"

  Scenario Outline: A malformed reference is rejected before reaching the use case
    When the requester gets an Incident by the reference "<reference>"
    Then the GET response is a validation failure with exactly one detail for "reference", rule "matches"

    Examples:
      | reference   |
      | INC000012   |
      | INC00001234 |
      | inc0000123  |
      | IN10000123  |
