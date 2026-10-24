import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  if (existsSync('.env')) loadEnvFile('.env');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/blog/v1');
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3001));
}

void bootstrap();
