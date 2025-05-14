export interface FundersCoreProgramModuleOptions {
  solanaRpcHttpEndpoint: string;
  fundersCoreProgramId: string;
}

export type FundersCore = {
  version: '0.1.0';
  name: 'funders_core';
  instructions: [
    {
      name: 'initialize';
      accounts: [
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'initializer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'admin';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'initializeUserAssetDataAccount';
      accounts: [
        {
          name: 'userAssetDataAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'fundersProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'userId';
          type: 'string';
        },
      ];
    },
    {
      name: 'updateConfig';
      accounts: [
        {
          name: 'config';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'newAdmin';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'newAdmin';
          type: 'publicKey';
        },
      ];
    },
    {
      name: 'mintSoulboundNft';
      accounts: [
        {
          name: 'userAssetDataAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'assetAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'assetAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'config';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'fundersProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'mplCoreProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'data';
          type: {
            defined: 'MintSoulboundNFTArgs';
          };
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'config';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'admin';
            type: 'publicKey';
          },
        ];
      };
    },
    {
      name: 'userAssetDataAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'publicKey';
          },
          {
            name: 'asset';
            type: 'publicKey';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'MintSoulboundNFTArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'uri';
            type: 'string';
          },
          {
            name: 'userId';
            type: 'string';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'AssetCreationError';
      msg: 'Failed to create asset during minting soulbound NFT';
    },
    {
      code: 6001;
      name: 'UpdateAssetMetadataError';
      msg: 'Failed to update asset metadata during minting soulbound NFT';
    },
    {
      code: 6002;
      name: 'UnknownError';
      msg: 'Unknown error has occured during minting soulbound NFT';
    },
    {
      code: 6003;
      name: 'Unauthorized';
      msg: 'Unauthorized';
    },
  ];
};

export const IDL: FundersCore = {
  version: '0.1.0',
  name: 'funders_core',
  instructions: [
    {
      name: 'initialize',
      accounts: [
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'initializer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'initializeUserAssetDataAccount',
      accounts: [
        {
          name: 'userAssetDataAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'fundersProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'userId',
          type: 'string',
        },
      ],
    },
    {
      name: 'updateConfig',
      accounts: [
        {
          name: 'config',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'newAdmin',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'newAdmin',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'mintSoulboundNft',
      accounts: [
        {
          name: 'userAssetDataAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'assetAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'assetAuthority',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'config',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'fundersProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'mplCoreProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'data',
          type: {
            defined: 'MintSoulboundNFTArgs',
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'config',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admin',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'userAssetDataAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'user',
            type: 'publicKey',
          },
          {
            name: 'asset',
            type: 'publicKey',
          },
          {
            name: 'createdAt',
            type: 'i64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'MintSoulboundNFTArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'userId',
            type: 'string',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'AssetCreationError',
      msg: 'Failed to create asset during minting soulbound NFT',
    },
    {
      code: 6001,
      name: 'UpdateAssetMetadataError',
      msg: 'Failed to update asset metadata during minting soulbound NFT',
    },
    {
      code: 6002,
      name: 'UnknownError',
      msg: 'Unknown error has occured during minting soulbound NFT',
    },
    {
      code: 6003,
      name: 'Unauthorized',
      msg: 'Unauthorized',
    },
  ],
};
