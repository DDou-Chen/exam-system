import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 如果有 就是免登接口，直接通过
    const skipLogin = this.reflector.getAllAndOverride('skip-login', [context.getHandler(), context.getClass()]);
    const RequireLogin = this.reflector.getAllAndOverride('require-login', [context.getHandler(), context.getClass()]);

    if (skipLogin && !RequireLogin) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = { ...data };

      // 单 token 自动续期
      response.header(
        'token',
        this.jwtService.sign(
          {
            userId: data.userId,
            username: data.username,
          },
          {
            expiresIn: '7d',
          },
        ),
      );

      return true;
    } catch (error) {
      throw new UnauthorizedException('请重新登陆');
    }
  }
}
