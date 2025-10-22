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
  // Support for Tray authentication form input
  auth_form_input?: {
    client_id: string;
    client_secret: string;
    environment: "production" | "sandbox" | "demo";
  };
};
