import type { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { RedisService } from 'src/modules/infrastructure/redis/redis.service';
import {
  RedisAuthOptions,
  RedisClient,
  RedisClientType,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
  TlsType,
} from 'src/modules/infrastructure/redis/types/redis.types';
import {
  REDIS_CLIENT,
  REDIS_MODULE_OPTIONS,
} from 'src/modules/infrastructure/redis/utils/redis.constants';
import type { Cluster as ClusterType, RedisOptions, Redis as RedisType } from 'ioredis';
import Redis, { Cluster } from 'ioredis';
import * as fs from 'fs';

@Global()
@Module({})
export class RedisModule {
  public static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports,
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: async (options: RedisModuleOptions): Promise<RedisClient> => {
            if (typeof options !== 'object' || !Object.keys(options).length) {
              throw new Error('Have no provided Redis options');
            }

            if (!options.nodes || !options.nodes.length) {
              throw new Error('Have no provided Redis nodes');
            }

            let tls: TlsType | undefined;

            if (options.tlsEnabled) {
              if ((!options.cert && !options.key) || !options.ca) {
                throw new Error('Have no provided Redis client certificates');
              }

              tls = {
                ca: options.ca ? fs.readFileSync(options.ca) : undefined,
                key: options.key ? fs.readFileSync(options.key) : undefined,
                cert: options.cert ? fs.readFileSync(options.cert) : undefined,
              };
            }

            const auth: RedisAuthOptions = {
              password: options.password,
              username: options.username,
            };

            const connections: RedisOptions[] = options.nodes.split(',').map(instance => {
              const [host, port] = instance.split(':');

              return { host, port: Number(port || 0) };
            });

            const client =
              connections.length > 1
                ? await RedisModule.getClusterClient(connections, { tls, auth })
                : await RedisModule.getStandaloneClient(connections[0], { tls, auth });

            const messageBrokerClient = await RedisModule.generateConnection(
              connections,
              tls,
              auth,
            );

            return {
              client,
              messageBrokerClient,
            };
          },
          inject: [REDIS_MODULE_OPTIONS],
        },
        {
          provide: REDIS_MODULE_OPTIONS,
          useFactory: options.useFactory || (() => {}),
          inject: options.inject,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }

  private static async generateConnection(
    connections: RedisOptions[],
    tls?: TlsType,
    auth?: RedisAuthOptions,
  ): Promise<RedisClientType> {
    return connections.length > 1
      ? await RedisModule.getClusterClient(connections, { tls, auth })
      : await RedisModule.getStandaloneClient(connections[0], { tls, auth });
  }

  private static async getClusterClient(
    nodes: RedisOptions[],
    { tls, auth }: { tls?: TlsType; auth?: RedisAuthOptions },
  ): Promise<ClusterType> {
    return new Cluster(nodes, {
      redisOptions: {
        tls,
        username: auth?.username,
        password: auth?.password,
      },
    });
  }

  private static async getStandaloneClient(
    options: RedisOptions,
    { tls, auth }: { tls?: TlsType; auth?: RedisAuthOptions },
  ): Promise<RedisType> {
    const { port, host } = options;

    return new Redis({
      port,
      host,
      tls,
      username: auth?.username,
      password: auth?.password,
      retryStrategy: times => (times < 100 ? 2_000 : 4_000),
    });
  }
}
