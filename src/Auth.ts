import type { Oauth2OperationHandlerAuth } from "@trayio/cdk-dsl/connector/operation/OperationHandler";

export type AspireUserAuth = {
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  environment: 'production' | 'sandbox';
  base_url?: string;
};

export type AspireAppAuth = {};

export type AspireAuth = Oauth2OperationHandlerAuth<AspireUserAuth, AspireAppAuth>;
