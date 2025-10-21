import { HttpHeaders } from "@trayio/commons/http/Http";

/**
 * Aspire API token response structure
 * From POST /Authorization endpoint
 * 
 * Based on https://guide.youraspire.com/apidocs/authentication-authorization-1
 */
export type AspireTokenResponse = {
  /** Bearer token (valid for 24 hours) */
  Token: string;
  /** Refresh token for getting a new access token */
  RefreshToken?: string;
};

/**
 * Token request output for Tray token-based authentication
 * This is what gets stored in ctx.auth.user after successful authentication
 */
export type TokenRequestOutput = {
  status_code: number;
  body: {
    /** Bearer access token from Aspire */
    access_token: string;
    /** Refresh token (optional) */
    refresh_token?: string;
  };
  headers: HttpHeaders;
};
