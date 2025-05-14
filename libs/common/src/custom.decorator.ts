import { SetMetadata } from '@nestjs/common';

export const SkipLogin = () => SetMetadata('skip-login', true);
export const RequireLogin = () => SetMetadata('require-login', true);
