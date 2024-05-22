import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AccessTokenGuard } from '@security/guards';
import { TransactionsService } from './transactions.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { Transaction } from './entities/transaction.entity';

/**
 * Controller to manage transactions.
 * @class
 */
@UseGuards(AccessTokenGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Retrieves all transactions for a user with pagination and filtering.
   *
   * @param {number} userId - ID of the user.
   * @param {PaginationAndFilterDto} paginationDto - DTO containing pagination and filter data.
   * @returns {Promise<{ transactions: Transaction[]; total: number }>} - The filtered transactions and total count.
   *
   * @example
   * GET /transactions/1/find-all?page=1&limit=10&sortBy=createdAt&sortOrder=ASC
   */
  @Get(':userId/find-all')
  findAll(
    @Param('userId') userId: number,
    @Query() paginationDto: PaginationAndFilterDto
  ): Promise<{ transactions: Transaction[]; total: number }> {
    return this.transactionsService.findAll(userId, paginationDto);
  }
}
