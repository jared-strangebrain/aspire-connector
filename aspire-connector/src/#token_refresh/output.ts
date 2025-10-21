import { HttpHeaders } from "@trayio/commons/http/Http";

export type AspireRefreshTokenResponse = {
  Token: string;
  RefreshToken?: string;
};

export type TokenRefreshOutput = {
  status_code: number;
  body: {
    access_token: string;
    refresh_token?: string;
  };
  headers: HttpHeaders;
};

