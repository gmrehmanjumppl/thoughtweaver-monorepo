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
  // Allow multiple origins for development (Next.js might run on different ports)
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:3001', // Alternative Next.js port
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        callback(null, true); // Allow in development, restrict in production
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
  console.log(`📚 API Documentation: See apps/api/API_DOCUMENTATION.md`);
  console.log(`❤️  Health Check: http://localhost:${port}/api/health`);
  console.log(`📖 Quick Reference:`);
  console.log(`   - Health: GET http://localhost:${port}/api/health`);
  console.log(`   - Conversations: GET http://localhost:${port}/api/conversations`);
  console.log(`   - Messages: GET http://localhost:${port}/api/conversations/:id/messages`);
  console.log(`   - Assistants: GET http://localhost:${port}/api/assistants`);
}

bootstrap();

