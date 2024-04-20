export interface JwtPayload {
  sub: number;
  role: string;
  version: number;
}

export interface JWTTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}
