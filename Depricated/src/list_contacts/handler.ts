// src/list_contacts/handler.ts
import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import { ensureBearer, getBaseUrlForEnvironment } from "../Auth.js";
import type { ListContactsInput } from "./input.js";
import type { ListContactsOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

// Minimal context shape used by our direct impl
type Ctx = { auth?: { user?: AspireAuth["user"] } };

// Direct implementation used by Jest; wrapped by CDK at runtime
export const __impl = async (ctx: Ctx, input: ListContactsInput) => {
  const user = ctx?.auth?.user;
  if (!user?.environment) throw new Error("Missing environment in auth context");
  const base = user.base_url ?? getBaseUrlForEnvironment(user.environment as any);

  const url = new URL("/api/Contacts", base);

  // Only set provided OData params
  if (input.$filter)  url.searchParams.set("$filter",  input.$filter);
  if (input.$select)  url.searchParams.set("$select",  input.$select);
  if (input.$orderby) url.searchParams.set("$orderby", input.$orderby);
  if (input.$top != null)  url.searchParams.set("$top",  String(input.$top));
  if (input.$skip != null) url.searchParams.set("$skip", String(input.$skip));
  if (input.$expand)  url.searchParams.set("$expand",  input.$expand);

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

  // Tolerant parsing: JSON if available, otherwise text
  const ctype = res.headers.get("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(out as ListContactsOutput);
};

// Export for runtime (CDK) vs tests (direct impl)
export const listContactsHandler = IS_TEST
  ? (__impl as any)
  : OperationHandlerSetup
      .configureHandler<AspireAuth, ListContactsInput, ListContactsOutput>((h) =>
        h.usingComposite(__impl as any)
      );
