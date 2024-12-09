import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class KafkaProducerService {
  private readonly kafka: Kafka;
  private readonly producer;

  constructor(private configService: AppConfigService) {
    this.kafka = new Kafka({
      brokers: [this.configService.kafkaHost],
    });
    this.producer = this.kafka.producer();
  }

  async sendRequestToKafka(correlationId: string, data: any): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic: 'inference-topic',
      messages: [
        {
          key: correlationId,
          value: JSON.stringify(data),
        },
      ],
    });
  }
}
