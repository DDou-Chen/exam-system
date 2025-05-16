import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export const SkipLogin = () => SetMetadata('skip-login', true);
export const RequireLogin = () => SetMetadata('require-login', true);

// 从 request 中取出 userInfo
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request?.user) {
    return null;
  }

  return data ? request.user[data] : request.user;
});
