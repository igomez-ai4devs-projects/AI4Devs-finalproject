# Backend Engineer Memory Index

- [TypeORM CLI env shadowing on this machine](feedback_typeorm_cli_env_shadowing.md) — always pass POSTGRES_* inline (dev DB on host port 5452); machine-wide vars shadow .env silently.
- [Cypress needs ELECTRON_RUN_AS_NODE unset](project_cypress_electron_run_as_node.md) — "bad option --smoke-test" is the VS Code shell env var, not a broken binary; unset it in the same Bash call.
- [TypeORM CLI has no tsconfig-paths](project_typeorm_cli_no_tsconfig_paths.md) — *.entity.ts files must avoid @sport-itsm/* alias imports or `pnpm typeorm` breaks outright.
- [DataSource boot must stay lazy](project_datasource_boot_must_stay_lazy.md) — eager connect in a global module factory breaks the untouchable harness-gating spec; connect on first repository use instead.
- [type:infrastructure libs need decorator tsconfig flags](feedback_infrastructure_libs_need_decorator_flags.md) — add experimentalDecorators+emitDecoratorMetadata to the lib's own tsconfig.json before writing entities/@Injectable adapters.
- [identity-access Actor vs. the scope rule](project_actor_scope_conflict.md) — every context needing authorization declares its own minimal actor view; report the cross-context conflict each time, don't wait for the architect to resolve it.
- [Global-provider testing-module gotcha](project_global_provider_testing_module_gotcha.md) — a context module's useFactory injecting a @Global() token breaks any narrow TestingModule importing just that context; add the global module to that test's imports too.
- [No express types in apps/api](project_no_express_types_in_apps_api.md) — express/@types/express aren't resolvable from apps/api; use a local structural interface for @Res()/ArgumentsHost request-response typing instead.
- [class-validator stopAtFirstError ordering](project_class_validator_stop_at_first_error_ordering.md) — global stopAtFirstError now set; @IsDefined() always runs first, other decorators fire bottom-up (closest to property first).
- [Check leftover dev server before manual verification](feedback_check_leftover_dev_server_before_manual_verification.md) — netstat/PID-start-time check the port before trusting curl; a stale nx serve from a prior session can still be listening.
