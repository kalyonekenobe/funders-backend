import { Global, Module } from '@nestjs/common';
import { StripeController } from 'src/modules/infrastructure/stripe/stripe.controller';
import { ConfigurableModuleClass } from 'src/modules/infrastructure/stripe/stripe.module-definition';
import { StripeService } from 'src/modules/infrastructure/stripe/stripe.service';

@Global()
@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule extends ConfigurableModuleClass {}
