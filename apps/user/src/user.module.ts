import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from '@app/redis';
import { PrismaModule } from '@app/prisma';
import { EmailModule } from '@app/email';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, CommonModule } from '@app/common';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory() {
        return {
          secret: 'doudou',
          signOptions: {
            expiresIn: '30m', // 过期时间默认30分钟
          },
        };
      },
    }),
    CommonModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserModule {}
