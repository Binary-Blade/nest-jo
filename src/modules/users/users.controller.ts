import { Controller, Get, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@common/decorators/role.decorator';
import { UpdateUserDto } from './dto';
import { AccessTokenGuard, IsCreatorGuard, RoleGuard } from '@security/guards';
import { UserRole } from '@common/enums/user-role.enum';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { User } from './entities/user.entity';

/**
 * Controller to manage users.
 * @class
 */
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  /**
   * Creates an instance of UsersController.
   *
   * @constructor
   * @param {UsersService} usersService - Service to manage users.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves all users with pagination and filtering. Only accessible by admins.
   *
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination and filter data.
   * @returns {Promise<{ users: User[]; total: number }>} - The filtered users and total count.
   *
   * @example
   * GET /users/get-all?page=1&limit=10&sortBy=createdAt&sortOrder=ASC
   */
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('get-all')
  findAll(
    @Query() paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ users: User[]; total: number }> {
    return this.usersService.findAll(paginationFilterDto);
  }

  /**
   * Retrieves all users. Only accessible by admins.
   *
   * @returns {Promise<User[]>} - List of all users.
   *
   * @example
   * GET /users/get-all-values
   */
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('get-all-values')
  findAllValues(): Promise<User[]> {
    return this.usersService.findAllValues();
  }

  /**
   * Retrieves a single user by ID. Only accessible by the user or admins.
   *
   * @param {string} id - ID of the user.
   * @returns {Promise<User>} - The found user.
   *
   * @example
   * GET /users/1
   */
  @UseGuards(IsCreatorGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  /**
   * Updates a user's information. Only accessible by the user or admins.
   *
   * @param {string} id - ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - DTO containing updated user information.
   * @returns {Promise<User>} - The updated user.
   *
   * @example
   * PATCH /users/1
   * {
   *   "firstName": "Updated",
   *   "lastName": "User"
   * }
   */
  @UseGuards(IsCreatorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Deactivates a user by setting their isActive flag to false. Only accessible by the user or admins.
   *
   * @param {string} id - ID of the user to deactivate.
   * @returns {Promise<void>}
   *
   * @example
   * PATCH /users/make-inactive/1
   */
  @UseGuards(IsCreatorGuard)
  @Patch('make-inactive/:id')
  makeInactive(@Param('id') id: string): Promise<void> {
    return this.usersService.removeUserActive(+id);
  }
}
