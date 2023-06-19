import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class NestredisService {
  constructor(private readonly redisService: RedisService) {}

  async setCache(key: string, value: string): Promise<void> {
    const client = this.redisService.getClient();
    await client.set(key, value);
  }

  async getCache(key: string): Promise<string> {
    const client = this.redisService.getClient();
    return client.get(key);
  }
}
