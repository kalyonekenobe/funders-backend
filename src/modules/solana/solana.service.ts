import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from 'src/core/enums/app.enums';
import { PrismaService } from 'src/modules/infrastructure/prisma/prisma.service';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createGenericFile, keypairIdentity, publicKey } from '@metaplex-foundation/umi';
import { v4 as uuid } from 'uuid';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { FundersCoreProgramService } from 'src/modules/infrastructure/funders-core-program/funders-core-program.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SolanaService {
  private readonly defaultSoulboundMetadataJson: any;
  private readonly defaultSoulboundImage: Buffer;

  constructor(
    private readonly fundersCoreProgramService: FundersCoreProgramService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.defaultSoulboundMetadataJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), '/static/metadata/soulbound.metadata.json'), {
        encoding: 'utf-8',
      }),
    );
    this.defaultSoulboundImage = fs.readFileSync(
      path.join(process.cwd(), '/static/metadata/soulbound.image.png'),
    );
  }

  public async createUser(userId: UserEntity['id']): Promise<void> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      omit: { refreshToken: true, role: true, password: true },
    });

    const admin = Keypair.fromSecretKey(
      bs58.decode(
        this.configService.get<string>(ConfigVariables.FundersCoreProgramAdminPrivateKey) || '',
      ),
    );

    if (!user.walletPublicKey) {
      throw new ForbiddenException(
        'The user must have Solana wallet connected to proceed this action',
      );
    }

    const userPublicKey = user.walletPublicKey;
    const mplTokenMetadataProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const mplCoreProgramId = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');

    const shortenedUserId = userId.replace(/-/g, '');

    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      this.fundersCoreProgramService.program.programId,
    );

    const [assetAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('asset_account'),
        Buffer.from(shortenedUserId),
        this.fundersCoreProgramService.program.programId.toBytes(),
      ],
      this.fundersCoreProgramService.program.programId,
    );

    const [userAssetDataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('user_asset_data_account'),
        Buffer.from(shortenedUserId),
        this.fundersCoreProgramService.program.programId.toBytes(),
      ],
      this.fundersCoreProgramService.program.programId,
    );

    const [assetAuthority] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('asset_authority'),
        this.fundersCoreProgramService.program.programId.toBytes(),
        assetAccount.toBytes(),
      ],
      this.fundersCoreProgramService.program.programId,
    );

    const solanaRpcHttpEndpoint =
      this.configService.get<string>(ConfigVariables.SolanaRpcHttpEndpoint) || '';

    const umi = createUmi(solanaRpcHttpEndpoint);
    const identity = keypairIdentity({
      publicKey: publicKey(admin.publicKey),
      secretKey: admin.secretKey,
    });

    umi.use(identity);
    umi.use(irysUploader());

    const genericFile = createGenericFile(
      new Uint8Array(this.defaultSoulboundImage),
      `${uuid()}.png`,
      {
        uniqueName: `${uuid()}.png`,
        contentType: 'image/png',
      },
    );

    const [imageUri] = await umi.uploader.upload([genericFile]);

    if (!imageUri) {
      throw new Error('The image uri cannot be undefined');
    }

    const datetimeFormatter = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'long',
    });

    const metadataJson = {
      ...this.defaultSoulboundMetadataJson,
      image: imageUri,
      properties: {
        ...(this.defaultSoulboundMetadataJson.properties || {}),
        files: [
          { uri: imageUri, type: 'image/png' },
          ...(this.defaultSoulboundMetadataJson.properties?.files?.slice(
            1,
            this.defaultSoulboundMetadataJson.properties.files.length - 1,
          ) || []),
        ],
      },
      attributes: [
        ...this.defaultSoulboundMetadataJson.attributes,
        {
          traitType: 'User ID',
          value: userId,
        },
        {
          traitType: 'Minted At',
          value: datetimeFormatter.format(Date.now()),
        },
      ],
    };

    const uri = await umi.uploader.uploadJson(metadataJson);

    const initializeUserAssetDataAccountInstruction =
      await this.fundersCoreProgramService.program.methods
        .initializeUserAssetDataAccount(shortenedUserId)
        .accounts({
          userAssetDataAccount,
          user: userPublicKey,
          admin: admin.publicKey,
          config: configPda,
          fundersProgram: this.fundersCoreProgramService.program.programId,
          systemProgram: SystemProgram.programId,
        })
        .signers([admin])
        .instruction();

    const mintSoulboundNftInstruction = await this.fundersCoreProgramService.program.methods
      .mintSoulboundNft({ uri, userId: shortenedUserId })
      .accounts({
        userAssetDataAccount,
        assetAccount,
        assetAuthority,
        user: userPublicKey,
        admin: admin.publicKey,
        config: configPda,
        fundersProgram: this.fundersCoreProgramService.program.programId,
        mplCoreProgram: mplCoreProgramId,
        systemProgram: SystemProgram.programId,
      })
      .signers([admin])
      .instruction();

    const { lastValidBlockHeight, blockhash } =
      await this.fundersCoreProgramService.connection.getLatestBlockhash();

    const messageV0 = new TransactionMessage({
      payerKey: admin.publicKey,
      instructions: [initializeUserAssetDataAccountInstruction, mintSoulboundNftInstruction],
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    transaction.sign([admin]);

    const signature = await this.fundersCoreProgramService.connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight: false,
        maxRetries: 3,
      },
    );

    await this.fundersCoreProgramService.connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed',
    );
  }
}
