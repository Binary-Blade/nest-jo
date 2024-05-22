import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NODE_ENV, PROD_ENV } from '@utils/constants/constants.env';
import { Request, Response } from 'express';

/**
 * Exception filter to handle HTTP exceptions.
 * @class
 * @implements {ExceptionFilter}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  /**
   * Method to catch and handle HTTP exceptions.
   *
   * @param {HttpException} exception - The caught HTTP exception.
   * @param {ArgumentsHost} host - The context for the caught exception.
   *
   * @example
   * throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const isNotProd = this.configService.get<string>(NODE_ENV) !== PROD_ENV;

    let responseMessage = exception.getResponse();
    let detailedErrors = {};

    // Check if the exception is a BadRequestException and extract detailed errors
    if (exception instanceof BadRequestException && isNotProd) {
      detailedErrors = (responseMessage as any).message;
      responseMessage = 'Validation failed'; // General message
    }

    // Construct the error response object.
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: responseMessage
    };

    // Include additional debugging information in non-production environments.
    if (isNotProd) {
      errorResponse['path'] = request.url;
      errorResponse['method'] = request.method;
      errorResponse['stack'] = exception.stack;
      errorResponse['errorDetails'] = detailedErrors;
    }

    this.logger.error(
      `Http Status: ${status}, Exception Message: ${exception.message}, Details: ${JSON.stringify(detailedErrors)}`
    );
    response.status(status).json(errorResponse);
  }
}
