# Backend Engineer Memory Index

- [TypeORM CLI env shadowing on this machine](feedback_typeorm_cli_env_shadowing.md) — always pass POSTGRES_* inline (dev DB on host port 5452); machine-wide vars shadow .env silently.
- [Cypress needs ELECTRON_RUN_AS_NODE unset](project_cypress_electron_run_as_node.md) — "bad option --smoke-test" is the VS Code shell env var, not a broken binary; unset it in the same Bash call.
