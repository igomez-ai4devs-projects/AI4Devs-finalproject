import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../config/configuration';
import { NodeEnvironment } from '../config/env.validation';
import { loadEnvironment } from '../config/environment';
import { EventDispatchModule } from '../event-dispatch/event-dispatch.module';
import { TestEventDispatchModule } from '../testing/test-event-dispatch.module';

/**
 * This module's own import list is decided once, when this file is first
 * evaluated — before Nest's DI container exists — which is why the
 * `NODE_ENV` gate below calls `loadEnvironment()` (the same sanctioned reader
 * `data-source.ts` uses outside a Nest context, `CLAUDE.md` §3) rather than
 * reading the raw environment variables directly here.
 */
const environment = loadEnvironment();

/**
 * `TestEventDispatchModule` exists only for the API-E2E acceptance scenario
 * of `T-C10-73` — see that controller's own doc comment
 * (`../testing/test-event-dispatch.controller.ts`). It is part of the module
 * graph only when `NODE_ENV=test`, so a request to its route answers `404` in
 * `development` and `production`, exactly like every other undeclared route
 * today (`apps/api-e2e/src/features/harness-smoke.feature`).
 */
const testOnlyModules =
  environment.NODE_ENV === NodeEnvironment.Test
    ? [TestEventDispatchModule]
    : [];

/**
 * The root module of the composition root (`ARCHITECTURE.md` §6.3).
 *
 * It holds no business logic and declares no controller of its own (besides
 * the `NODE_ENV=test`-only exception above): its job is to import one
 * composition module per bounded context, each binding that context's port
 * tokens to concrete adapters (ADR-003), plus the cross-cutting
 * `EventDispatchModule` that binds `EventPublisherPort` for all of them
 * (`T-C10-73`). No context library exists yet.
 */
@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    EventDispatchModule,
    ...testOnlyModules,
  ],
})
export class AppModule {}
