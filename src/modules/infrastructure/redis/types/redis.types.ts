import type { ModuleMetadata } from '@nestjs/common/interfaces';
import type { Cluster as ClusterType, Redis as RedisType, RedisOptions } from 'ioredis';

export type TlsType = { ca?: Buffer; key?: Buffer; cert?: Buffer };

export type RedisConnectionOptions = { nodes: string };
export type RedisAuthOptions = { username: string; password: string };
export type RedisCustomOptions = { tlsEnabled: boolean } & TlsType;
export type RedisModuleOptions = RedisConnectionOptions & RedisCustomOptions & RedisAuthOptions;

interface NodeConfiguration {
  host?: string | undefined;
  port?: number | undefined;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | ((
        | RedisModuleOptions
        | NodeConfiguration[]
        | Promise<RedisModuleOptions>
        | Promise<NodeConfiguration[]>
      ) &
        RedisCustomOptions)
    | Promise<RedisCustomOptions>;
  inject?: any[];
}

export type RedisClientType = RedisType | ClusterType;

export interface RedisClient {
  client: RedisClientType;
  messageBrokerClient: RedisClientType;
}
