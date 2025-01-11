import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
});
