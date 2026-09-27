# T-C1-08 — requester intake of an Incident, over real HTTP against the
# ephemeral E2E database (`apps/api-e2e`'s own `e2e-db-up`/`e2e-migrate`
# targets), with no mocked repository or use case anywhere in this run.
#
# "No Incident was created" (AC1) is proven honestly without a read-by-
# reference route (`T-C1-99`/`T-C1-100` are out of this ticket's scope): the
# reference sequence only advances when `LogIncidentUseCase.execute()`
# actually reaches `IncidentRepositoryPort.nextReference()`, which never
# happens for a request `ValidationPipe` rejects before the controller body
# runs. Each scenario logs a baseline Incident, attempts the rejected
# request, then logs another valid Incident and asserts its reference is
# exactly the baseline's next value — proving nothing was created in between.
Feature: Requester intake of an Incident (T-C1-08, US-C1-01, FR-INC-01)

  Scenario Outline: The server rejects a priority-bearing field the client is never offered, and creates nothing
    Given a baseline Incident has just been logged
    And a fresh Incident intake request body
    And the request body also carries a "<field>" property
    When the requester posts the Incident intake request
    Then the response is a validation failure naming "<field>"
    And no Incident was created since the baseline

    Examples:
      | field                        |
      | impact                       |
      | urgency                      |
      | priority                     |
      | competitionAffectsInProgress |

  Scenario: A request missing a mandatory field names the field and its rule
    Given a fresh Incident intake request body
    And the request body has no "shortDescription" property
    When the requester posts the Incident intake request
    Then the response is a validation failure naming "shortDescription"

  Scenario: A valid request creates the Incident and returns only its reference
    Given a fresh Incident intake request body
    When the requester posts the Incident intake request
    Then the response is 201 with a reference shaped like "INC" plus 7 digits
    And the response body carries no field the requester may not see
