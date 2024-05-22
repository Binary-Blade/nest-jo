import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto';
import { QueryHelperService } from '@database/query/query-helper.service';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';

/**
 * Service to manage users.
 * @class
 */
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService.
   *
   * @constructor
   * @param {Repository<User>} usersRepository - Repository for the User entity.
   * @param {QueryHelperService} queryHelper - Service to build query options.
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly queryHelper: QueryHelperService
  ) {}

  /**
   * Retrieves all users with pagination and filtering.
   *
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination and filter data.
   * @returns {Promise<{ users: User[]; total: number }>} - The filtered users and total count.
   *
   * @throws {InternalServerErrorException} If an error occurs while retrieving users.
   *
   * @example
   * const result = await usersService.findAll(paginationFilterDto);
   */
  async findAll(
    paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ users: User[]; total: number }> {
    const queryOptions = this.queryHelper.buildQueryOptions<User>(paginationFilterDto);

    try {
      const [users, total] = await this.usersRepository.findAndCount(queryOptions);
      return { users, total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users', error.message);
    }
  }

  /**
   * Retrieves all users.
   *
   * @returns {Promise<User[]>} - List of all users.
   *
   * @example
   * const users = await usersService.findAllValues();
   */
  async findAllValues(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds a user by ID.
   *
   * @param {number} userId - ID of the user.
   * @returns {Promise<User>} - The found user.
   *
   * @throws {NotFoundException} If the user is not found.
   *
   * @example
   * const user = await usersService.findOne(1);
   */
  async findOne(userId: number): Promise<User> {
    const user = await this.verifyUserOneBy(userId);
    return user;
  }

  /**
   * Updates a user's information.
   *
   * @param {number} userId - ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - DTO containing updated user information.
   * @returns {Promise<User>} - The updated user.
   *
   * @throws {NotFoundException} If the user is not found.
   *
   * @example
   * const updatedUser = await usersService.update(1, updateUserDto);
   */
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.verifyUserOneBy(userId);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Deactivates a user by setting their isActive flag to false.
   *
   * @param {number} userId - ID of the user to deactivate.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the user is not found.
   *
   * @example
   * await usersService.removeUserActive(1);
   */
  async removeUserActive(userId: number): Promise<void> {
    const user = await this.verifyUserOneBy(userId);
    user.isActive = false;
    await this.usersRepository.save(user);
  }

  /**
   * Verifies a user exists by their ID.
   *
   * @param {number} userId - ID of the user.
   * @returns {Promise<User>} - The verified user.
   *
   * @throws {NotFoundException} If the user is not found.
   *
   * @example
   * const user = await usersService.verifyUserOneBy(1);
   */
  async verifyUserOneBy(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }

  /**
   * Verifies a user exists by their ID and loads specified relations.
   *
   * @param {number} userId - ID of the user.
   * @param {string} relations - Relations to load.
   * @returns {Promise<User>} - The verified user with relations loaded.
   *
   * @throws {NotFoundException} If the user is not found.
   *
   * @example
   * const user = await usersService.verifyUserOneRelation(1, 'profile');
   */
  async verifyUserOneRelation(userId: number, relations: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: [relations]
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }
}
