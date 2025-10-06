import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import { ensureBearer, getBaseUrlForEnvironment } from "../Auth.js";
import type { ListUsersInput } from "./input.js";
import type { ListUsersOutput } from "./output.js";

// minimal ctx for tests
type Ctx = { auth?: { user?: AspireAuth["user"] } };

export const __impl = async (ctx: Ctx, input: ListUsersInput) => {
  const user = ctx?.auth?.user;
  if (!user?.environment) throw new Error("Missing environment in auth context");
  const base = user.base_url ?? getBaseUrlForEnvironment(user.environment as any);

  const url = new URL("/api/Users", base);
  if (input.$filter)  url.searchParams.set("$filter",  input.$filter);
  if (input.$select)  url.searchParams.set("$select",  input.$select);
  if (input.$orderby) url.searchParams.set("$orderby", input.$orderby);
  if (input.$top  != null) url.searchParams.set("$top",  String(input.$top));
  if (input.$skip != null) url.searchParams.set("$skip", String(input.$skip));
  if (input.$expand) url.searchParams.set("$expand", input.$expand);

  const token = await ensureBearer(ctx as any);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  const ctype = res.headers?.get?.("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(out as ListUsersOutput);
};

// ⬇️ ONLY register with CDK at runtime, not in Jest
const IS_TEST = !!process.env.JEST_WORKER_ID;

export const listUsersHandler = IS_TEST
  ? (__impl as any)
  : OperationHandlerSetup
      .configureHandler<AspireAuth, ListUsersInput, ListUsersOutput>((h) =>
        h.usingComposite(__impl as any)
      );
