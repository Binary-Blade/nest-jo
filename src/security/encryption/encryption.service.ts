import { User } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

/**
 * Provides security utilities for password hashing and verification.
 */
@Injectable()
export class EncryptionService {
  /**
   * Hashes a plaintext password using the Argon2 algorithm.
   *
   * @param password The plaintext password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  /**
   * Verifies a plaintext password against a given hash.
   *
   * @param hash The hash to verify against.
   * @param password The plaintext password to verify.
   * @returns A promise that resolves to a boolean indicating if the password matches the hash.
   */
  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  /**
   * Generates a UUID v4 key.
   *
   * @returns A promise that resolves to a UUID v4 key.
   */
  async generatedKeyUuid(): Promise<string> {
    return uuidv4();
  }

  /**
   * Generates a secure key for a user.
   *
   * @param user The user to generate the secure key for.
   * @returns A promise that resolves to a secure key.
   **/
  async generatedSecureKey(user: User): Promise<string> {
    const purchaseKey = await this.generatedKeyUuid();
    return `${user.accountKey}-${purchaseKey}`;
  }

  /**
   * Generates a QR code for a secure key.
   *
   * @param secureKey The secure key to generate the QR code for.
   * @returns A promise that resolves to a data URL for the QR code.
   */
  async generatedQRCode(secureKey: string): Promise<string> {
    return await qrcode.toDataURL(secureKey);
  }
}
