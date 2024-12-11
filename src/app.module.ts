import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InferenceController } from './inference/inference.controller';
import { InferenceService } from './inference/inference.service';
import { RedisService } from './redis/redis.service';
import { AppConfigService } from './config/config.service';
import kafkaConfig from './config/kafka.config';
import redisConfig from './config/redis.config';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig, redisConfig],
    }),
  ],
  controllers: [InferenceController],
  providers: [
    AppConfigService,
    RedisService,
    KafkaProducerService,
    KafkaConsumerService,
    InferenceService,
  ],
})
export class AppModule {}
