import { ArgumentsHost, BadRequestException, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { PROD_ENV } from '@utils/constants/constants.env';
import { HttpExceptionFilter } from './http-exceptions-filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should log and return formatted error response in non-production environment', () => {
    const mockConfigServiceGet = configService.get as jest.Mock;
    mockConfigServiceGet.mockReturnValue('development');

    const mockLoggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const mockResponseStatus = jest.fn().mockReturnThis();
    const mockResponseJson = jest.fn();

    const mockResponse = {
      status: mockResponseStatus,
      json: mockResponseJson
    } as unknown as Response;

    const mockRequest = {
      url: '/test-url',
      method: 'GET'
    } as unknown as Request;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse
      })
    } as unknown as ArgumentsHost;

    const exception = new BadRequestException({
      message: ['Validation failed']
    });

    filter.catch(exception, mockHost);

    expect(mockResponseStatus).toHaveBeenCalledWith(400);
    expect(mockResponseJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Validation failed',
        path: '/test-url',
        method: 'GET',
        stack: expect.any(String),
        errorDetails: ['Validation failed']
      })
    );
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Http Status: 400, Exception Message: Bad Request Exception, Details: ["Validation failed"]'
    );

    mockLoggerError.mockRestore();
  });

  it('should return formatted error response in production environment', () => {
    const mockConfigServiceGet = configService.get as jest.Mock;
    mockConfigServiceGet.mockReturnValue(PROD_ENV);

    const mockLoggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const mockResponseStatus = jest.fn().mockReturnThis();
    const mockResponseJson = jest.fn();

    const mockResponse = {
      status: mockResponseStatus,
      json: mockResponseJson
    } as unknown as Response;

    const mockRequest = {
      url: '/test-url',
      method: 'GET'
    } as unknown as Request;

    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse
      })
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Forbidden', 403);

    filter.catch(exception, mockHost);

    expect(mockResponseStatus).toHaveBeenCalledWith(403);
    expect(mockResponseJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: 'Forbidden'
      })
    );
    expect(mockResponseJson).not.toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/test-url',
        method: 'GET',
        stack: expect.any(String),
        errorDetails: expect.any(Object)
      })
    );
    expect(mockLoggerError).toHaveBeenCalledWith(
      'Http Status: 403, Exception Message: Forbidden, Details: {}'
    );

    mockLoggerError.mockRestore();
  });
});
