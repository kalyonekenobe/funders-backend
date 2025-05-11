import * as Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import Redlock from 'redlock';
import { REDIS_CLIENT } from 'src/modules/infrastructure/redis/utils/redis.constants';
import { RedisClient } from 'src/modules/infrastructure/redis/types/redis.types';

@Injectable()
export class RedisService {
  public client: Redis.Redis | Redis.Cluster;
  private readonly messageBroker: Redis.Redis | Redis.Cluster;
  private readonly redlock: Redlock;

  public constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {
    this.client = this.getClient();
    this.messageBroker = this.getMessageBroker();
  }

  private getClient(): Redis.Redis | Redis.Cluster {
    this.redis.client.ping().catch(() => this.redis.client.connect());

    return this.redis.client;
  }

  private getMessageBroker(): Redis.Redis | Redis.Cluster {
    this.redis.messageBrokerClient.ping().catch(() => this.redis.messageBrokerClient.connect());

    return this.redis.messageBrokerClient;
  }

  public async publish(channel: string, message: any, index = 0): Promise<'OK' | null> {
    const [, [error, result]]: any = await this.client
      .multi()
      .select(index)
      .publish(channel, JSON.stringify(message))
      .exec();

    if (error) {
      throw error;
    }

    return result;
  }

  public async get<T>(key: string, index = 0): Promise<T | null> {
    const [, [error, result]]: any = await this.client.multi().select(index).get(key).exec();

    if (error) {
      throw error;
    }

    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }

  public async getByPattern(
    pattern: string,
    index = 0,
    options?: { limit?: number; sortByTtl?: boolean },
  ): Promise<any | null> {
    let [, [keysError, keys]]: any = await this.client.multi().select(index).keys(pattern).exec();

    if (keysError) {
      throw keysError;
    }

    if (keys.length === 0) {
      return [];
    }

    if (options?.limit) {
      keys = keys.slice(0, options.limit);
    }

    const [, [error, result]]: any = await this.client.multi().select(index).mget(keys).exec();

    if (error) {
      throw error;
    }

    try {
      if (result?.length > 0) {
        if (options?.limit) {
          return result.slice(0, options.limit).map(item => JSON.parse(item));
        }

        return result.map(item => JSON.parse(item));
      }

      return [];
    } catch {
      return result;
    }
  }

  public async scanByPattern(
    pattern: string,
    index = 0,
    options?: { limit?: number; sortByTtl?: boolean },
  ): Promise<any[] | null> {
    await this.client.select(index);

    const limit = options?.limit ?? Infinity;
    const sortByTtl = options?.sortByTtl ?? false;

    const results: { key: string; ttl: number }[] = [];
    let cursor = '0';

    do {
      const [nextCursor, keys]: [string, string[]] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        1000,
      );
      cursor = nextCursor;

      if (sortByTtl) {
        const ttlResults = await Promise.all(
          keys.map(async key => {
            const ttl = await this.client.ttl(key);
            return ttl >= 0 ? { key, ttl } : null;
          }),
        );
        results.push(...(ttlResults.filter(Boolean) as { key: string; ttl: number }[]));
      } else {
        results.push(...keys.map(key => ({ key, ttl: 0 }))); // TTL ignored
      }

      if (results.length >= limit) break;
    } while (cursor !== '0');

    const selectedKeys = (sortByTtl ? results.sort((a, b) => a.ttl - b.ttl) : results)
      .slice(0, limit)
      .map(r => r.key);

    if (selectedKeys.length === 0) return [];

    const values = await this.client.mget(selectedKeys);

    return values.map(val => {
      try {
        if (!val) {
          throw Error('Value is empty');
        }

        return JSON.parse(val);
      } catch {
        return val;
      }
    });
  }

  public async deleteByPattern(pattern: string, index = 0): Promise<number> {
    const [, [keysError, keys]]: any = await this.client.multi().select(index).keys(pattern).exec();

    if (keysError) {
      throw keysError;
    }

    if (keys.length === 0) {
      return 0;
    }

    const [, [delError, delResult]]: any = await this.client
      .multi()
      .select(index)
      .del(...keys)
      .exec();

    if (delError) {
      throw delError;
    }

    return delResult;
  }

  public async set(key: string, value: any, index = 0, ttl?: number): Promise<'OK' | null> {
    if (ttl && ttl > 0) {
      const [, [error, result]]: any = await this.client
        .multi()
        .select(index)
        .set(key, JSON.stringify(value, null, 2), 'EX', ttl)
        .exec();

      if (error) {
        throw error;
      }

      return result;
    }

    const [, [error, result]]: any = await this.client
      .multi()
      .select(index)
      .set(key, JSON.stringify(value, null, 2))
      .exec();

    if (error) {
      throw error;
    }

    return result;
  }

  public subscribeToKey<TValue>(
    key: string,
    handler: (message: TValue | null) => Promise<void> | void,
  ): void {
    const channelName = `__keyspace@0__:${key}`;

    this.subscribe(channelName, async (message: any) => {
      if (message === 'set') {
        const newValue = await this.get<TValue>(key);
        await handler(newValue);
      }
    });
  }

  private subscribe(channelName: string, handler: (message) => void | Promise<void>): void {
    this.messageBroker.subscribe(channelName, () => null);
    this.messageBroker.on('message', async (channel, message) => {
      if (channel === channelName) {
        await handler(message);
      }
    });
  }

  public async delete(key: string, index = 0): Promise<number> {
    const [, [error, result]]: any = await this.client.multi().select(index).del(key).exec();

    if (error) {
      throw error;
    }

    return result;
  }

  public async getIncr(key: string, index = 0): Promise<number> {
    const [, [, result]]: any = await this.client.multi().select(index).incr(key).exec();

    return result;
  }

  public async setAdd(key: string, value: any, index = 0): Promise<number> {
    const [, [error, result]]: any = await this.client
      .multi()
      .select(index)
      .sadd(key, value)
      .exec();

    if (error) {
      throw error;
    }

    return result;
  }

  public async flushDb(): Promise<'OK'> {
    return this.client.flushdb();
  }

  public async setDelete(key: string, value: any, index = 0): Promise<number> {
    const [, [error, result]]: any = await this.client
      .multi()
      .select(index)
      .srem(key, 1, value)
      .exec();

    if (error) {
      throw error;
    }

    return result;
  }

  public async setGet<T>(key: string, index = 0): Promise<T> {
    const [, [error, result]]: any = await this.client.multi().select(index).smembers(key).exec();

    if (error) {
      throw error;
    }

    return result;
  }
}
