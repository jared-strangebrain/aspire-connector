// src/Auth.ts  ← note the capital A to match imports like ../Auth.js
import type { TokenOperationHandlerAuth } from "@trayio/cdk-dsl/connector/operation/OperationHandler";

export type AspireUserAuth = {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;                 // ISO string; optional but useful for reauth
  environment: "production" | "sandbox";
  base_url: string;                    // required: all handlers use it
};

export type AspireAppAuth = {};

export type AspireAuth = TokenOperationHandlerAuth<AspireUserAuth, AspireAppAuth>;
