import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get kafkaClientId(): string {
    return this.configService.get<string>('kafka.clientId');
  }

  get kafkaBrokers(): string[] {
    return this.configService.get<string[]>('kafka.brokers');
  }

  get kafkaTopic(): string {
    return this.configService.get<string>('kafka.topic');
  }

  get redisHost(): string {
    return this.configService.get<string>('redis.host');
  }

  get redisPort(): number {
    return this.configService.get<number>('redis.port');
  }
}
