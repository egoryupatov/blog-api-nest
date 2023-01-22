import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT = process.env.PORT || 3005;
  const HOST = process.env.HOST || 'https://blogger-server.onrender.com';
  await app.listen(PORT, HOST);
}
bootstrap();
