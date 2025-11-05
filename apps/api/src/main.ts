import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties
      transform: true, // Transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 API Server running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
  console.log(`❤️  Health Check: http://localhost:${port}/api/health`);
}

bootstrap();

