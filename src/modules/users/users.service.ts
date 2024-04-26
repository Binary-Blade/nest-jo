import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto';

/**
 * Service providing user management functionality.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  /**
   * Finds all users.
   *
   * @returns A promise resolved with the list of all user entities.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds a single user by their ID.
   *
   * @param id The ID of the user to find.
   * @returns A promise resolved with the user entity.
   * @throws NotFoundException if the user is not found.
   */
  async findOne(userId: number): Promise<User> {
    const user = await this.verifyUserOneBy(userId);
    return user;
  }

  /**
   * Updates a user's data.
   *
   * @param id The ID of the user to update.
   * @param updateUserDto The new data for the user.
   * @returns A promise resolved with the updated user entity.
   * @throws NotFoundException if the user is not found.
   */
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.verifyUserOneBy(userId);
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Removes a user from the database.
   *
   * @param id The ID of the user to remove.
   * @throws NotFoundException if the user is not found.
   */
  async remove(userId: number): Promise<void> {
    const user = await this.verifyUserOneBy(userId);
    await this.usersRepository.remove(user);
  }

  /**
   * Verifies that a user exists in the database.
   *
   * @param userId The ID of the user to verify.
   * @returns A promise resolved with the user entity.
   * @throws NotFoundException if the user does not exist.
   */
  async verifyUserOneBy(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return user;
  }

  /**
   * Verifies that a user exists in the database with the specified relations.
   *
   * @param userId The ID of the user to verify.
   * @param relations The relations to include in the query.
   * @returns A promise resolved with the user entity.
   * @throws NotFoundException if the user does not exist.
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
