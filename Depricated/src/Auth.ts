// src/Auth.ts  ← note the capital A to match imports like ../Auth.js
import type { TokenOperationHandlerAuth } from "@trayio/cdk-dsl/connector/operation/OperationHandler";

export type AspireUserAuth = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;                 // ISO string; optional but useful for reauth
  environment: "production" | "sandbox" | "demo";
  base_url?: string;                   // derived from environment if not provided
  // For Tray-managed background auth, allow storing client credentials
  client_id?: string;
  client_secret?: string;
};

export type AspireAppAuth = {};

export type AspireAuth = TokenOperationHandlerAuth<AspireUserAuth, AspireAppAuth>;

// ---- Background token management helpers (used by handlers) ----

function parseExpiry(expiresAt?: string | null): number | null {
  if (!expiresAt) return null;
  const ts = Date.parse(expiresAt);
  return Number.isNaN(ts) ? null : ts;
}

function dueForEarlyRefresh(expiresAt?: string | null): boolean {
  const ts = parseExpiry(expiresAt);
  if (ts === null) return false; // if unknown expiry, assume valid and do not refresh
  return ts - Date.now() <= 60 * 60 * 1000; // <= 1 hour remaining
}

export function getBaseUrlForEnvironment(env: AspireUserAuth["environment"]): string {
  switch (env) {
    case "production":
      return "https://cloud-api.youraspire.com";
    case "sandbox":
      return "https://cloudsandbox-api.youraspire.com";
    case "demo":
      return "https://clouddemo-api.youraspire.com";
  }
}

/**
 * Ensure we have a valid Bearer token. If token is missing or near expiry and
 * we have credentials, mint/refresh in-place on ctx.auth.user and return it.
 */
export async function ensureBearer(ctx: { auth?: { user?: AspireUserAuth } }): Promise<string> {
  const user = ctx?.auth?.user;
  if (!user) throw new Error("Missing auth user context");

  // If we already have a non-expiring token, use it
  if (user.access_token && !dueForEarlyRefresh(user.expires_at)) {
    return user.access_token;
  }

  // Need to mint or refresh; require environment and client creds or refresh token
  const environment = user.environment;
  if (!environment) throw new Error("Missing environment in auth context");
  const base = user.base_url ?? getBaseUrlForEnvironment(environment);

  const shouldRefresh = Boolean(user.refresh_token) && dueForEarlyRefresh(user.expires_at);
  const url = new URL(shouldRefresh ? "/Authorization/RefreshToken" : "/Authorization", base).toString();

  let body: Record<string, unknown>;
  if (shouldRefresh) {
    body = { RefreshToken: user.refresh_token };
  } else {
    if (!user.client_id || !user.client_secret) {
      throw new Error("Missing client_id/client_secret to mint access token");
    }
    body = { ClientId: user.client_id, Secret: user.client_secret };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Aspire auth failed (${res.status}): ${t}`);
  }

  const data: any = await res.json().catch(() => ({}));
  const access = data.accessToken ?? data.AccessToken ?? data.token ?? data.Token ?? data.jwt ?? data.JWT;
  if (!access) throw new Error("Aspire auth response missing access token");
  const refresh = data.refreshToken ?? data.RefreshToken ?? data.refresh_token ?? data.Refresh_token ?? user.refresh_token;
  const expiresIn = data.expiresIn ?? data.ExpiresIn ?? data.expires_in;
  const expiresAt = typeof expiresIn === "number" ? new Date(Date.now() + expiresIn * 1000).toISOString() : user.expires_at;

  // Persist back into context for subsequent calls
  user.access_token = String(access);
  user.refresh_token = refresh ? String(refresh) : undefined;
  user.expires_at = expiresAt;
  user.base_url = base; // ensure

  return user.access_token;
}
