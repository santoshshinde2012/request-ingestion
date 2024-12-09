import { Module } from '@nestjs/common';
import { KafkaProducerService } from './services/kafka-producer.service';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import { RedisService } from './services/redis.service';
import { InferenceController } from './controllers/inference.controller';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [],
  controllers: [InferenceController],
  providers: [
    KafkaProducerService,
    KafkaConsumerService,
    RedisService,
    AppConfigService,
  ],
})
export class InferenceModule {}
