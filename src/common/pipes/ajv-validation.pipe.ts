import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import Ajv, { ErrorObject } from 'ajv';

@Injectable()
export class AjvValidationPipe implements PipeTransform {
  private ajv: Ajv;

  constructor(private schema: object) {
    this.ajv = new Ajv({ allErrors: true });
  }

  transform(value: any) {
    const validate = this.ajv.compile(this.schema);
    const valid = validate(value);

    if (!valid) {
      const errors = (validate.errors || []).map((err: ErrorObject) => ({
        message: err.message,
      }));

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: errors,
      });
    }

    return value;
  }
}
