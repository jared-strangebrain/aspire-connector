import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";

export type TokenRequestInput = {
  client_id: string;
  client_secret: string;
  environment: "production" | "sandbox";
};

export type TokenRequestOutput = AspireAuth["user"];

const BASES = {
  production: "https://cloud-api.youraspire.com",
  sandbox: "https://cloudsandbox-api.youraspire.com",
} as const;

const AUTH = { mint: "/Authorization", refresh: "/Authorization/RefreshToken" } as const;

function dueForEarlyRefresh(expires_at?: string | null): boolean {
  if (!expires_at) return true;
  const exp = Date.parse(expires_at);
  if (Number.isNaN(exp)) return true;
  return exp - Date.now() <= 60 * 60 * 1000; // <= 1h remaining
}

function pick<T>(...vals: Array<T | undefined | null>): T | undefined {
  return vals.find((v) => v !== undefined && v !== null);
}

export const tokenRequestHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, TokenRequestInput, TokenRequestOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = BASES[input.environment];
      const current = ctx?.auth?.user;
      const haveRefresh = Boolean(current?.refresh_token);
      const shouldRefresh = haveRefresh && dueForEarlyRefresh(current?.expires_at);

      const url = base + (shouldRefresh ? AUTH.refresh : AUTH.mint);
      const body = shouldRefresh
        ? { RefreshToken: current!.refresh_token }
        : { ClientId: input.client_id, Secret: input.client_secret };

      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Aspire auth failed (${res.status}): ${text}`);
      }

      const data: any = await res.json().catch(() => ({}));

      const access_token = pick<string>(
        data.accessToken, data.AccessToken, data.token, data.Token, data.jwt, data.JWT
      );
      if (!access_token) throw new Error("Aspire auth response missing access token");

      const refresh_token = pick<string | undefined>(
        data.refreshToken, data.RefreshToken, data.refresh_token, data.Refresh_token, current?.refresh_token
      );

      const expires_in = pick<number | undefined>(
        data.expiresIn, data.ExpiresIn, data.expires_in
      );

      const expires_at =
        typeof expires_in === "number"
          ? new Date(Date.now() + expires_in * 1000).toISOString()
          : current?.expires_at;

      return OperationHandlerResult.success({
        access_token,
        refresh_token,
        environment: input.environment,
        base_url: base,
        expires_at,
      });
    })
  );
