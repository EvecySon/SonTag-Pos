import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // CORS for frontend
  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({ origin, credentials: true });

  // Default to port 4000 for local dev
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  await app.listen(port);
}
bootstrap();
