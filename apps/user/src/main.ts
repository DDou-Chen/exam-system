import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 开启 transform, 把参数转为 dto 的实例
    }),
  );

  await app.listen(3001);
}
bootstrap();
