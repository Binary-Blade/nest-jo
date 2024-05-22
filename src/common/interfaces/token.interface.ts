/**
 * Interface representing the configuration for tokens.
 *
 * @interface TokenConfig
 */
export interface TokenConfig {
  /**
   * Secret key used to sign access tokens.
   * @type {string}
   *
   * @example
   * const config: TokenConfig = { accessTokenSecret: 'myAccessTokenSecret', accessTokenExpiration: '1h', refreshTokenSecret: 'myRefreshTokenSecret', refreshTokenExpiration: '7d' };
   */
  accessTokenSecret: string;

  /**
   * Expiration time for access tokens.
   * @type {string}
   *
   * @example
   * const config: TokenConfig = { accessTokenSecret: 'myAccessTokenSecret', accessTokenExpiration: '1h', refreshTokenSecret: 'myRefreshTokenSecret', refreshTokenExpiration: '7d' };
   */
  accessTokenExpiration: string;

  /**
   * Secret key used to sign refresh tokens.
   * @type {string}
   *
   * @example
   * const config: TokenConfig = { accessTokenSecret: 'myAccessTokenSecret', accessTokenExpiration: '1h', refreshTokenSecret: 'myRefreshTokenSecret', refreshTokenExpiration: '7d' };
   */
  refreshTokenSecret: string;

  /**
   * Expiration time for refresh tokens.
   * @type {string}
   *
   * @example
   * const config: TokenConfig = { accessTokenSecret: 'myAccessTokenSecret', accessTokenExpiration: '1h', refreshTokenSecret: 'myRefreshTokenSecret', refreshTokenExpiration: '7d' };
   */
  refreshTokenExpiration: string;
}
