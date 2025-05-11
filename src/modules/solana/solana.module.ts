import { Module } from '@nestjs/common';
import { SolanaService } from 'src/modules/solana/solana.service';

@Module({
  providers: [SolanaService],
  exports: [SolanaService],
})
export class SolanaModule {}
