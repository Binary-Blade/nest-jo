import { Module } from '@nestjs/common';
import { ThrottlerModule as Throttler } from '@nestjs/throttler';

@Module({
  imports: [
    Throttler.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])
  ]
})
export class ThrollerModule {}
