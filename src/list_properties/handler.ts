import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import { ensureBearer, getBaseUrlForEnvironment } from "../Auth.js";
import type { ListPropertiesInput } from "./input.js";
import type { ListPropertiesOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

type Ctx = { auth?: { user?: { base_url?: string; access_token?: string; environment?: any } } };

export const __impl = async (ctx: Ctx, input: ListPropertiesInput) => {
  const user = ctx?.auth?.user;
  if (!user?.environment) throw new Error("Missing environment in auth context");
  const base = user.base_url ?? getBaseUrlForEnvironment(user.environment as any);

  const url = new URL("/api/Properties", base);
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
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${t}`);
  }

  const ctype = res.headers.get("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(out as ListPropertiesOutput);
};

// CDK export (guarded during Jest)
export const listPropertiesHandler = IS_TEST
  ? (__impl as any)
  : OperationHandlerSetup
      .configureHandler<AspireAuth, ListPropertiesInput, ListPropertiesOutput>((h) =>
        h.usingComposite(__impl as any)
      );
