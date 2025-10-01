import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { ListContactTypesInput } from "./input.js";
import type { ListContactTypesOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

// Minimal ctx type matching what we read
type Ctx = { auth?: { user?: AspireAuth["user"] } };

const impl = async (ctx: Ctx, input: ListContactTypesInput) => {
  const base = ctx?.auth?.user?.base_url;
  if (!base) throw new Error("Missing base_url in auth context");

  const url = new URL("/api/ContactTypes", base);

  // Set only defined OData params
  if (input.$filter)  url.searchParams.set("$filter",  input.$filter);
  if (input.$select)  url.searchParams.set("$select",  input.$select);
  if (input.$orderby) url.searchParams.set("$orderby", input.$orderby);
  if (input.$top !== undefined)  url.searchParams.set("$top",  String(input.$top));
  if (input.$skip !== undefined) url.searchParams.set("$skip", String(input.$skip));
  if (input.$expand)  url.searchParams.set("$expand",  input.$expand);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ctx!.auth!.user!.access_token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  // Be tolerant if API ever returns text
  const ctype = res.headers.get("content-type") || "";
  const data: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");

  return OperationHandlerResult.success(data as ListContactTypesOutput);
};

// Export: plain function in tests, CDK-wired in runtime
export const listContactTypesHandler = IS_TEST
  ? impl
  : OperationHandlerSetup
      .configureHandler<AspireAuth, ListContactTypesInput, ListContactTypesOutput>((handler) =>
        handler.usingComposite(impl as any)
      );
