export type ApiRefreshTokenRequest = {
  RefreshToken?: string;
};

export type AuthorizationRefreshTokenInput = {
  /**
   * Request body
   */
  body: ApiRefreshTokenRequest;
  // Original parameter name: api-version
  api_version?: string;
};
