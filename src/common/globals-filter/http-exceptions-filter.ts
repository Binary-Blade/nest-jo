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
 * A global exception filter that catches all HTTP exceptions and formats
 * the response to include helpful debugging information in non-production environments.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Logger instance for the HttpExceptionFilter.
   *
   * @private
   * @type {Logger}
   * @memberof HttpExceptionFilter
   * @readonly
   */
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name);

  /**
   * Constructor for the HttpExceptionFilter.
   * @param configService - The configuration service
   */
  constructor(private configService: ConfigService) {}

  /**
   * Method to catch and handle HTTP exceptions.
   *
   * @param exception The caught HttpException.
   * @param host The arguments host containing information about the request context.
   * @returns void
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

    // Log the error message and send the response.
    this.logger.error(
      `Http Status: ${status}, Exception Message: ${exception.message}, Details: ${JSON.stringify(detailedErrors)}`
    );
    response.status(status).json(errorResponse);
  }
}
