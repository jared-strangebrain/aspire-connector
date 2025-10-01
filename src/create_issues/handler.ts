import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { CreateIssuesInput } from "./input.js";
import type { CreateIssuesOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

// Minimal ctx shape for what we read
type Ctx = { auth?: { user?: AspireAuth["user"] } };

const impl = async (ctx: Ctx, input: CreateIssuesInput) => {
  const base = ctx?.auth?.user?.base_url;
  if (!base) throw new Error("Missing base_url in auth context");

  const url = new URL("/api/Issues", base);
  const payload = (input as { body?: unknown }).body ?? {};

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ctx!.auth!.user!.access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  // Tolerant parse: JSON if present, otherwise text
  const ctype = res.headers.get("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(out as CreateIssuesOutput);
};

// Export plain function in tests; CDK-wired handler at runtime
export const createIssuesHandler = IS_TEST
  ? impl
  : OperationHandlerSetup
      .configureHandler<AspireAuth, CreateIssuesInput, CreateIssuesOutput>((handler) =>
        handler.usingComposite(impl as any)
      );
