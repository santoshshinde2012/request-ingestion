import { Module } from '@nestjs/common';
import { InferenceController } from './controllers/inference.controller';
import { InferenceService } from './application/services/inference.service';
import { KafkaProducer } from './infrastructure/kafka/kafka.producer';
import { RedisService } from './infrastructure/redis/redis.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './infrastructure/config/config.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [InferenceController],
  providers: [InferenceService, KafkaProducer, RedisService, ConfigService],
})
export class AppModule {}
