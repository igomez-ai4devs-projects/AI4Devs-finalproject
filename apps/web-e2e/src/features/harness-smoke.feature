# Harness smoke test — it proves the acceptance chain (Nx target -> served
# shell -> Cypress -> Gherkin -> step definitions) is wired end to end.
#
# It asserts only the shell's own structure (the routed `main` landmark, the
# router settling on `/`), never the routed child's own content — that is
# `home.feature`'s job since T-C1-103 gave `/` a real page. Keeping this
# scenario's own steps unchanged is deliberate: it is the regression guard
# for T-C1-103's route-table change (that ticket's own AC4).
Feature: The web acceptance harness reaches the served application shell

  Scenario: The shell renders its main landmark with the default route resolved
    When the harness visits the application root
    Then the shell exposes its main landmark
    And the router has settled on the default route
