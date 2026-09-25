import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GLOBAL_PREFIX, GLOBAL_PREFIX_EXCLUSIONS } from './app/global-prefix';
import type { EnvironmentVariables } from './config/env.validation';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX, { exclude: GLOBAL_PREFIX_EXCLUSIONS });

  // `whitelist` strips undeclared properties, `forbidNonWhitelisted` rejects
  // the request outright rather than silently ignoring them, and `transform`
  // instantiates the DTO class so its declared types are real at runtime
  // (`ARCHITECTURE.md` §6.3).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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
