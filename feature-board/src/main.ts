import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//ponto de entrada da aplicação
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração mais específica do CORS
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Adiciona validação global
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000, () => {
    console.log('Backend rodando na porta 3000');
  });
}
bootstrap();