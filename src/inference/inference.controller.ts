import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpException,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { InferenceService } from './inference.service';
import { AjvValidationPipe } from 'src/common/pipes/ajv-validation.pipe';
import { querySchema } from 'src/schema/input.schema';

@Controller('inference')
export class InferenceController {
  constructor(private readonly inferenceService: InferenceService) {}

  @Post('request')
  @UsePipes(new AjvValidationPipe(querySchema))
  @HttpCode(HttpStatus.ACCEPTED)
  async postInference(@Body() input: any): Promise<{ correlationId: string }> {
    try {
      const { correlationId } =
        await this.inferenceService.handleRequest(input);

      return { correlationId };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('result/:correlationId')
  async getResult(@Param('correlationId') correlationId: string): Promise<any> {
    try {
      if (!correlationId) {
        throw new HttpException('Invalid input data', HttpStatus.BAD_REQUEST);
      }

      const result = await this.inferenceService.getResult(correlationId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
