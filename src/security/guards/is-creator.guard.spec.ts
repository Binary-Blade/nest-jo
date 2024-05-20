import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IsCreatorGuard } from './is-creator.guard';

describe('IsCreatorGuard', () => {
  let guard: IsCreatorGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsCreatorGuard, Reflector]
    }).compile();

    guard = module.get<IsCreatorGuard>(IsCreatorGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should return true if the user is the content creator', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 1 },
          params: { id: '1' }
        })
      })
    } as unknown as ExecutionContext;

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if the user is not the content creator', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 1 },
          params: { id: '2' }
        })
      })
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user is not present in the request', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: '1' }
        })
      })
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(NotFoundException);
  });
});
