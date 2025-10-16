export type ApiAuthenticationRequest = {
  ClientId: string;
  Secret: string;
};

export type AuthorizationAuthenticateApiRequestInput = {
  /**
   * Request body
   */
  body: ApiAuthenticationRequest;
  // Original parameter name: api-version
  api_version?: string;
};
