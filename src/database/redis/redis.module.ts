import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Module to set up and configure Redis client and Redis service.
 * @module
 */
@Module({
  imports: [ConfigModule],
  providers: [
    /**
     * Provides the Redis client instance.
     *
     * @remarks
     * The Redis client is configured using environment variables accessed through ConfigService.
     *
     * @example
     * {
     *   provide: 'REDIS_CLIENT',
     *   useFactory: async (configService: ConfigService) =>
     *     new Redis({
     *       host: configService.get('REDIS_HOST'),
     *       port: configService.get('REDIS_PORT'),
     *       password: configService.get('REDIS_PASSWORD')
     *     }),
     *   inject: [ConfigService]
     * }
     */
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) =>
        new Redis({
          host: configService.get('REDIS_HOST'), // Redis server host
          port: configService.get('REDIS_PORT'), // Redis server port
          password: configService.get('REDIS_PASSWORD') // Redis server password
        }),
      inject: [ConfigService]
    },
    RedisService
  ],
  exports: ['REDIS_CLIENT', RedisService]
})
export class RedisModule {}
