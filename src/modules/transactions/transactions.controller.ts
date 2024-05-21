import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AccessTokenGuard } from '@security/guards';
import { TransactionsService } from './transactions.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';

@UseGuards(AccessTokenGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Find all transactions for a user
   *
   * @param userId - The ID of the user to find transactions for
   * @returns - A list of transactions for the user
   * @throws NotFoundException if the user does not exist
   */
  @Get(':userId/find-all')
  findAll(@Param('userId') userId: number, @Query() paginationDto: PaginationAndFilterDto) {
    return this.transactionsService.findAll(userId, paginationDto);
  }
}
