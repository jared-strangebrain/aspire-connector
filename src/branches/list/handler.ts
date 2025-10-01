import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { ListBranchesInput } from "./input.js";
import type { ListBranchesOutput } from "./output.js";

export const listBranchesHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, ListBranchesInput, ListBranchesOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Branches", base);

      if (input.$filter)  url.searchParams.set("$filter",  input.$filter);
      if (input.$select)  url.searchParams.set("$select",  input.$select);
      if (input.$orderby) url.searchParams.set("$orderby", input.$orderby);
      if (input.$top !== undefined)  url.searchParams.set("$top",  String(input.$top));
      if (input.$skip !== undefined) url.searchParams.set("$skip", String(input.$skip));
      if (input.$expand)  url.searchParams.set("$expand",  input.$expand);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

      const data = (await res.json()) as ListBranchesOutput;
      return OperationHandlerResult.success(data);
    })
  );
