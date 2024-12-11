import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InferenceService } from './inference.service';

@Controller('inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

  @Post()
  async postInference(@Body() input: any): Promise<{ correlationId: string }> {
    const { correlationId } = await this.inferenceService.handleRequest(input);
    return { correlationId };
  }

  @Get()
  async getResult(@Query('correlationId') correlationId: string): Promise<any> {
    const result = await this.inferenceService.getResult(correlationId);
    if (!result) {
      return { status: 'PENDING', message: 'Result not yet available' };
    }
    return result;
  }
}
