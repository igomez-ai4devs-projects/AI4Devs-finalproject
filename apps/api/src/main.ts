import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GLOBAL_PREFIX, GLOBAL_PREFIX_EXCLUSIONS } from './app/global-prefix';
import { GlobalExceptionFilter } from './app/global-exception.filter';
import {
  flattenValidationErrors,
  RequestValidationException,
} from './app/request-validation.exception';
import type { EnvironmentVariables } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // `DatabaseModule` (`T-C1-06`) closes its `DataSource` from
  // `onApplicationShutdown()`, which Nest only invokes for OS shutdown
  // signals (SIGTERM/SIGINT) when shutdown hooks are explicitly enabled.
  app.enableShutdownHooks();

  app.setGlobalPrefix(GLOBAL_PREFIX, { exclude: GLOBAL_PREFIX_EXCLUSIONS });

  // `whitelist` strips undeclared properties, `forbidNonWhitelisted` rejects
  // the request outright rather than silently ignoring them, and `transform`
  // instantiates the DTO class so its declared types are real at runtime
  // (`ARCHITECTURE.md` §6.3). `exceptionFactory` replaces Nest's default
  // `BadRequestException` (`{ statusCode, message: string[], error }`) with
  // `RequestValidationException`, carrying the contract-shaped
  // `{ field, rule }` details `GlobalExceptionFilter` expects (`T-C1-08`
  // Trap 3) — without it, a validation failure would never reach the
  // `ErrorEnvelope` `ARCHITECTURE.md` §3.2 promises.
  //
  // `stopAtFirstError: true` is deliberately **global**, not scoped to one
  // DTO: it is the app-wide policy that a single property reports at most
  // one violated rule (its first, in the decorator order that DTO declares
  // — see `LogIncidentRequesterDto`'s own doc comment for how that ordering
  // works), never a cascade of every decorator that happened to fail on the
  // same bad value. `T-C1-10` renders each `{ field, rule }` detail as one
  // "what to do now" message (NFR-USE-05); a cascade would only repeat that
  // message for the same field. This applies to every DTO going forward —
  // a DTO that legitimately needs to report more than one independent
  // problem per property does not exist yet, and if one ever does, it is
  // that DTO's decorators (not this global option) that should change.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new RequestValidationException(flattenValidationErrors(errors)),
    }),
  );

  // The minimum exception filter this delivery slice owes
  // (`GlobalExceptionFilter`'s own doc comment) — `T-C10-40`'s real one does
  // not exist yet.
  app.useGlobalFilters(new GlobalExceptionFilter());

  // The port comes from the validated configuration, never from the raw
  // environment: by this point a missing or malformed `PORT` has already
  // aborted the boot inside `ConfigModule`.
  const config =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  const port = config.getOrThrow('PORT', { infer: true });

  await app.listen(port);

  Logger.log(
    `Sport ITSM API listening on http://localhost:${port}/${GLOBAL_PREFIX}`,
    'Bootstrap',
  );
}

void bootstrap();
