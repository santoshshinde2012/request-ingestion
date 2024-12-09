import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class RedisService {
  private client: Redis;
  private cacheTimeout: number;

  constructor(private configService: AppConfigService) {
    this.client = new Redis({
      host: this.configService.redisHost,
      port: this.configService.redisPort,
    });
    this.cacheTimeout = this.configService.cacheTimeout;
  }

  async storeInferenceResult(
    correlationId: string,
    result: any,
  ): Promise<void> {
    await this.client.setex(
      correlationId,
      this.cacheTimeout,
      JSON.stringify(result),
    );
  }

  async getInferenceResult(correlationId: string): Promise<any> {
    const result = await this.client.get(correlationId);
    return result ? JSON.parse(result) : null;
  }
}
