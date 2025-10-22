export interface ApiAuthenticationResult {
  Token?: string;
  RefreshToken?: string;
}

export type AuthorizationAuthenticateApiRequestOutput = ApiAuthenticationResult;
