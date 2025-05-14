import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { RoutesApiTags } from 'src/core/constants';
import { Auth } from 'src/core/decorators/auth.decorator';
import { Routes } from 'src/core/enums/app.enums';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChargeDto } from 'src/modules/infrastructure/payment/DTO/charge.dto';
import { PaymentService } from 'src/modules/infrastructure/payment/payment.service';
import { PaymentChargeResponse } from 'src/modules/infrastructure/payment/types/payment.types';

@ApiTags(RoutesApiTags[Routes.Payments])
@Controller(Routes.Payments)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({ description: 'Payment intent was successfully created.' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error was occured.' })
  @Post('charge')
  public async charge(@Body() chargeDto: ChargeDto): Promise<PaymentChargeResponse> {
    return this.paymentService.charge(chargeDto);
  }
}
