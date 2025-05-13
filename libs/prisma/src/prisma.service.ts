import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// 继承 PrismaClient，这样它就有 crud 的 api 了
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 设置 PrismaClient 的 log 参数，也就是打印 sql 到控制台
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }

  // 生命周期方法
  async onModuleInit() {
    // 调用 $connect 来连接数据库
    await this.$connect();
  }
}
