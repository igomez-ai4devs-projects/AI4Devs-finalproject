# T-C10-73 — proves the generic post-commit event dispatcher end to end, over
# real HTTP, using a deliberately-failing generic test subscriber and a
# generic test event registered by `TestEventDispatchController`
# (`apps/api/src/testing/`).
#
# That controller is registered only when NODE_ENV=test
# (`apps/api/src/app/app.module.ts`), which is exactly the environment the
# `api-e2e` target boots the API under (`project.json`). This is a dedicated
# scenario for a dedicated mechanism — not a change to `harness-smoke.feature`
# or the route-free assertion T-C10-06 imposes on it.
Feature: The post-commit event dispatcher isolates a failing subscriber

  Scenario: A subscriber that throws does not stop the event reaching a healthy subscriber, nor the caller's own success
    When the harness dispatches a generic test event with one failing subscriber and one healthy subscriber registered
    Then the harness call succeeds
    And the healthy subscriber received the event
