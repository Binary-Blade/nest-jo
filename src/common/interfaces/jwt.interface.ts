/**
 * Interface for JWT payload
 *
 * @property {number} sub - The subject of the JWT.
 * @property {string} role - The role of the user.
 * @property {number} version - The version of the JWT.
 */
export interface JwtPayload {
  sub: number;
  role: string;
  version: number;
}

/**
 * Interface for JWT tokens
 *
 * @property {string} accessToken - The access token.
 * @property {string} refreshToken - The refresh token.
 * @property {number} expiresIn - The expiration time of the token.
 */
export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}
