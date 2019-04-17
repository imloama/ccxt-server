declare const module: any;

import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as limit from 'fastify-rate-limit';

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // swagger
  const options = new DocumentBuilder()
    .setTitle('CCXT Server')
    .setDescription('ccxt server supports by nestjs')
    .setVersion('1.0')
    .addTag('ccxt')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  app.use(helmet());
  // app.use(csurf());
  // rate limit
  app.register(limit, {
    max: 100,
    timeWindow: '1 minute',
    whitelist: ['127.0.0.1'],
  })
  // enable cors
  app.enableCors();

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  
}
bootstrap();
