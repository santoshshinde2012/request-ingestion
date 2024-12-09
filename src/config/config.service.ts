import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaHost(): string {
    return this.configService.get<string>('KAFKA_HOST');
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  get cacheTimeout(): number {
    return this.configService.get<number>('CACHE_INVALIDATION_TIME');
  }
}
