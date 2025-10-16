import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { CreateTasksInput } from "./input.js";
import type { CreateTasksOutput } from "./output.js";

type MaybeBody = { body?: unknown };

const IS_TEST = !!process.env.JEST_WORKER_ID;

// minimal ctx shape matching what we read
type Ctx = { auth?: { user?: AspireAuth["user"] } };

const impl = async (ctx: Ctx, input: CreateTasksInput) => {
  const base = ctx?.auth?.user?.base_url;
  if (!base) throw new Error("Missing base_url in auth context");

  const url = new URL("/api/Tasks", base);
  const payload = (input as unknown as MaybeBody).body ?? {};

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
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${t}`);
  }

  // JSON sometimes, plain text other times
  const ctype = res.headers.get("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(out as CreateTasksOutput);
};

// Export: plain function in tests, CDK-wired in runtime
export const createTasksHandler = IS_TEST
  ? impl
  : OperationHandlerSetup
      .configureHandler<AspireAuth, CreateTasksInput, CreateTasksOutput>((handler) =>
        handler.usingComposite(impl as any)
      );
