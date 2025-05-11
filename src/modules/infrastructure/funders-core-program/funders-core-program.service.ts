import { Inject, Injectable } from '@nestjs/common';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { MODULE_OPTIONS_TOKEN } from 'src/modules/infrastructure/funders-core-program/funders-core-program.module-definition';
import { Connection, Keypair } from '@solana/web3.js';
import {
  IDL,
  FundersCore,
  FundersCoreProgramModuleOptions,
} from 'src/modules/infrastructure/funders-core-program/types/funders-core-program.types';
import { address } from '@solana/kit';

@Injectable()
export class FundersCoreProgramService extends AnchorProvider {
  public readonly program: Program<FundersCore>;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: FundersCoreProgramModuleOptions) {
    super(new Connection(options.solanaRpcHttpEndpoint), new Wallet(Keypair.generate()), {
      commitment: 'confirmed',
    });

    this.program = new Program<FundersCore>(
      IDL as unknown as FundersCore,
      address(options.fundersCoreProgramId),
      this,
    );
  }
}
