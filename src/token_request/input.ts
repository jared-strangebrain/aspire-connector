// src/token_request/input.ts
export type TokenRequestInput = {
  client_id: string;
  client_secret: string;
  environment: "production" | "sandbox" | "demo";
};
