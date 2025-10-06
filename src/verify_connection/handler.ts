// src/verify_connection/handler.ts
import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import { ensureBearer, getBaseUrlForEnvironment } from "../Auth.js";
import type { VerifyConnectionInput } from "./input.js";
import type { VerifyConnectionOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

// Minimal context shape for what we read
type Ctx = { auth?: { user?: AspireAuth["user"] } };

// Unit-testable core implementation
export const __impl = async (ctx: Ctx, input: VerifyConnectionInput) => {
  const user = ctx?.auth?.user;
  if (!user?.environment) throw new Error("Missing environment in auth context");
  const base = user.base_url ?? getBaseUrlForEnvironment(user.environment as any);
  const token = await ensureBearer(ctx as any);

  const url = new URL("/api/Contacts", base);
  url.searchParams.set("$top", String(input.$top ?? 1));
  if (input.$select) url.searchParams.set("$select", input.$select);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Verify connection failed (${res.status}): ${body}`);
  }

  const ctype = res.headers.get("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(out as VerifyConnectionOutput);
};

// Plain function in tests; CDK-wired handler at runtime
export const verifyConnectionHandler = IS_TEST
  ? (__impl as any)
  : OperationHandlerSetup
      .configureHandler<AspireAuth, VerifyConnectionInput, VerifyConnectionOutput>((handler) =>
        handler.usingComposite(__impl as any)
      );
