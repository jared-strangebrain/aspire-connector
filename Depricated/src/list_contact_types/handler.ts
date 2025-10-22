import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { ListContactTypesInput } from "./input.js";
import type { ListContactTypesOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

type Ctx = { auth?: { user?: { base_url?: string; access_token?: string } } };

export const __impl = async (ctx: Ctx, input: ListContactTypesInput) => {
  const base = ctx?.auth?.user?.base_url;
  if (!base) throw new Error("Missing base_url in auth context");

  const url = new URL("/api/ContactTypes", base);
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
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${t}`);
  }

  const out = (await res.json()) as ListContactTypesOutput;
  return OperationHandlerResult.success(out);
};

export const listContactTypesHandler = IS_TEST
  ? (__impl as any)
  : OperationHandlerSetup
      .configureHandler<AspireAuth, ListContactTypesInput, ListContactTypesOutput>((h) =>
        h.usingComposite(__impl as any)
      );
