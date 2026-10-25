import { ValidationPipe, type INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ApiExceptionFilter } from './common/api-exception.filter.js';

export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api/blog/v1');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, forbidNonWhitelisted: true, transform: true,
    validationError: { target: false, value: false },
  }));
  app.useGlobalFilters(new ApiExceptionFilter());
}
