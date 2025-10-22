export interface ApiAuthenticationResult {
  Token?: string;
  RefreshToken?: string;
}

export type AuthorizationRefreshTokenOutput = ApiAuthenticationResult;
