/**
 * Interface representing the payload of a JWT.
 *
 * @interface JwtPayload
 */
export interface JwtPayload {
  /**
   * Subject identifier (usually the user ID).
   * @type {number}
   *
   * @example
   * const payload: JwtPayload = { sub: 1, role: 'user', version: 1 };
   */
  sub: number;

  /**
   * Role of the user.
   * @type {string}
   *
   * @example
   * const payload: JwtPayload = { sub: 1, role: 'admin', version: 1 };
   */
  role: string;

  /**
   * Version of the token.
   * @type {number}
   *
   * @example
   * const payload: JwtPayload = { sub: 1, role: 'user', version: 2 };
   */
  version: number;
}

/**
 * Interface representing JWT tokens.
 *
 * @interface JWTTokens
 */
export interface JWTTokens {
  /**
   * The access token.
   * @type {string}
   *
   * @example
   * const tokens: JWTTokens = { accessToken: 'abc123', refreshToken: 'def456' };
   */
  accessToken: string;

  /**
   * The refresh token.
   * @type {string}
   *
   * @example
   * const tokens: JWTTokens = { accessToken: 'abc123', refreshToken: 'def456' };
   */
  refreshToken: string;

  /**
   * Expiration time of the token in seconds (optional).
   * @type {number}
   *
   * @example
   * const tokens: JWTTokens = { accessToken: 'abc123', refreshToken: 'def456', expiresIn: 3600 };
   */
  expiresIn?: number;
}
