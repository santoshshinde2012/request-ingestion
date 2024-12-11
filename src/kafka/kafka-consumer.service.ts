import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { RedisService } from '../redis/redis.service';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly redisService: RedisService,
  ) {
    this.kafka = new Kafka({
      clientId: this.appConfigService.kafkaClientId,
      brokers: this.appConfigService.kafkaBrokers,
    });
    this.consumer = this.kafka.consumer({ groupId: 'inference-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    console.log('Kafka Consumer connected');

    await this.consumer.subscribe({
      topic: this.appConfigService.kafkaTopic,
      fromBeginning: true,
    });

    this.consumer.run({
      eachMessage: async ({ message }) => {
        const correlationId = message.key.toString();
        const payload = JSON.parse(message.value.toString());

        console.log(
          `Received message for correlation ID: ${correlationId}`,
          payload,
        );

        // Simulate processing
        const result = this.simulateInference(payload);

        // Store result in Redis
        await this.redisService.setResult(correlationId, result);
        console.log(
          `Result stored in Redis for correlation ID: ${correlationId}`,
        );
      },
    });
  }

  private simulateInference(data: any): Record<string, any> {
    return {
      status: 'COMPLETED',
      data: `Processed data for input: ${data.input}`,
      timestamp: new Date().toISOString(),
    };
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    console.log('Kafka Consumer disconnected');
  }
}
