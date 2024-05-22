import { User } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service to handle encryption tasks.
 * @class
 */
@Injectable()
export class EncryptionService {
  /**
   * Hashes a password using Argon2.
   *
   * @param {string} password - The plain text password to hash.
   * @returns {Promise<string>} - The hashed password.
   *
   * @example
   * const hashedPassword = await encryptionService.hashPassword('password123');
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verifies a password against a hash using Argon2.
   *
   * @param {string} hash - The hashed password.
   * @param {string} password - The plain text password to verify.
   * @returns {Promise<boolean>} - Whether the password is valid.
   *
   * @example
   * const isValid = await encryptionService.verifyPassword(hashedPassword, 'password123');
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  /**
   * Generates a UUID.
   *
   * @returns {Promise<string>} - The generated UUID.
   *
   * @example
   * const uuid = await encryptionService.generatedKeyUuid();
   */
  async generatedKeyUuid(): Promise<string> {
    return uuidv4();
  }

  /**
   * Generates a secure key for a user by combining the user's account key with a new UUID.
   *
   * @param {User} user - The user entity.
   * @returns {Promise<string>} - The generated secure key.
   *
   * @example
   * const secureKey = await encryptionService.generatedSecureKey(user);
   */
  async generatedSecureKey(user: User): Promise<string> {
    const purchaseKey = await this.generatedKeyUuid();
    return `${user.accountKey}-${purchaseKey}`;
  }

  /**
   * Generates a QR code from a secure key.
   *
   * @param {string} secureKey - The secure key to encode in the QR code.
   * @returns {Promise<string>} - The generated QR code as a data URL.
   *
   * @example
   * const qrCode = await encryptionService.generatedQRCode(secureKey);
   */
  async generatedQRCode(secureKey: string): Promise<string> {
    return await qrcode.toDataURL(secureKey);
  }
}
