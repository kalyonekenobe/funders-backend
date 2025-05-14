import { Module } from '@nestjs/common';
import { PaymentController } from 'src/modules/infrastructure/payment/payment.controller';
import { PaymentService } from 'src/modules/infrastructure/payment/payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
