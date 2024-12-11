import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private readonly appConfigService: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.appConfigService.kafkaClientId,
      brokers: this.appConfigService.kafkaBrokers,
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka Producer connected');
  }

  async sendMessage(correlationId: string, data: any): Promise<void> {
    await this.producer.send({
      topic: this.appConfigService.kafkaTopic,
      messages: [
        {
          key: correlationId,
          value: JSON.stringify(data),
        },
      ],
    });
    console.log(`Message sent to Kafka with correlation ID: ${correlationId}`);
  }
}
