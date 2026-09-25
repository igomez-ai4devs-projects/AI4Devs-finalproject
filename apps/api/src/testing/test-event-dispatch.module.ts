import { Module } from '@nestjs/common';
import { TestEventDispatchController } from './test-event-dispatch.controller';

/**
 * Registered only when `NODE_ENV=test` (`../app/app.module.ts`). See
 * `TestEventDispatchController`'s own doc comment for why this exists and
 * why it must never be wired into `development` or `production`.
 */
@Module({
  controllers: [TestEventDispatchController],
})
export class TestEventDispatchModule {}
