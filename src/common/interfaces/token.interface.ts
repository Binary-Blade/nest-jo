/**
 * Interface for token configuration
 *
 * @property {string} accessTokenSecret - The secret for the access token.
 * @property {string} accessTokenExpiration - The expiration time for the access token.
 * @property {string} refreshTokenSecret - The secret for the refresh token.
 * @property {string} refreshTokenExpiration - The expiration time for the refresh token.
 */
export interface TokenConfig {
  accessTokenSecret: string;
  accessTokenExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
}
