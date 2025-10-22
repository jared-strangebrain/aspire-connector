export type AspireTokenResponse = {
  Token: string;
  RefreshToken?: string;
};

// For Token Based authentication, output should be the token data directly
export type TokenRequestOutput = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};
