import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AppConfigService } from '../../config/config.service';
import { RedisService } from './redis.service'; // RedisService for storing results

@Injectable()
export class KafkaConsumerService {
  private readonly kafka: Kafka;
  private readonly consumer;

  constructor(
    private configService: AppConfigService,
    private redisService: RedisService,
  ) {
    this.kafka = new Kafka({
      brokers: [this.configService.kafkaHost],
    });
    this.consumer = this.kafka.consumer({ groupId: 'inference-group' });
  }

  async startConsuming(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'inference-topic',
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const { key, value } = message;
        const correlationId = key.toString();
        const data = JSON.parse(value.toString());

        // Simulate inference processing
        const inferenceResult = await this.processInference(data);

        // Store result in Redis
        await this.redisService.storeInferenceResult(
          correlationId,
          inferenceResult,
        );
      },
    });
  }

  private async processInference(data: any): Promise<any> {
    // Simulate inference logic (use ML model or any processing)
    return { result: `Processed data for ${data.modelId}` };
  }
}
