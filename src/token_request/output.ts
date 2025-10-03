// src/token_request/output.ts
export type TokenRequestOutput = {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  environment: "production" | "sandbox";
  base_url: string;
};
