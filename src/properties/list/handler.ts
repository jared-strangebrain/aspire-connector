import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { ListPropertiesInput } from "./input.js";
import type { ListPropertiesOutput } from "./output.js";

export const listPropertiesHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, ListPropertiesInput, ListPropertiesOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Properties", base);

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
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

      // Tolerant parsing: JSON if available, otherwise text
      const ctype = res.headers.get("content-type") || "";
      const data = ctype.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "");

      return OperationHandlerResult.success(data as ListPropertiesOutput);
    })
  );
