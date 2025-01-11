import { Global, Module } from '@nestjs/common';
import { PasswordService } from 'src/modules/infrastructure/password/password.service';
import { ConfigurableModuleClass } from 'src/modules/infrastructure/password/password.module-definition';

@Global()
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule extends ConfigurableModuleClass {}
