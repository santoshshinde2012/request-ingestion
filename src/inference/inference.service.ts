import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Injectable()
export class InferenceService {
  constructor(
    private readonly kafkaService: KafkaProducerService,
    private readonly redisService: RedisService,
  ) {}

  async handleRequest(requestData: any) {
    const correlationId = uuidv4();
    const existingResult = await this.redisService.getResult(correlationId);

    if (existingResult) {
      return { correlationId };
    }

    await this.kafkaService.sendMessage(correlationId, requestData);
    return { correlationId };
  }

  async getResult(correlationId: string) {
    const result = await this.redisService.getResult(correlationId);
    return result ? JSON.parse(result) : null;
  }
}
