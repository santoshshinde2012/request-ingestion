import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { KafkaProducerService } from '../services/kafka-producer.service';
import { RedisService } from '../services/redis.service';
import * as uuid from 'uuid';

@Controller('inference')
export class InferenceController {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly redisService: RedisService,
  ) {}

  @Post('request')
  async requestInference(
    @Body() data: any,
  ): Promise<{ correlationId: string }> {
    const correlationId = uuid.v4();
    await this.kafkaProducerService.sendRequestToKafka(correlationId, data);
    return { correlationId };
  }

  @Get('result/:correlationId')
  async getInferenceResult(
    @Param('correlationId') correlationId: string,
  ): Promise<any> {
    const result = await this.redisService.getInferenceResult(correlationId);
    if (!result) {
      throw new Error('Result not available');
    }
    return result;
  }
}
