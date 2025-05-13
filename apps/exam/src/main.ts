import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 8888, // 用 connectMicroservice 暴露 8888 的 TCP 服务
    },
  });

  // await app.startAllMicroservices(); // 启动 TCP 服务

  await app.listen(3002); // 暴露了 3002 的 HTTP 服务
}
bootstrap();
