import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { ListUsersInput } from "./input.js";
import type { ListUsersOutput } from "./output.js";

export const listUsersHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, ListUsersInput, ListUsersOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Users", base);

      // Set only provided OData params
      if (input.$filter)  url.searchParams.set("$filter",  input.$filter);
      if (input.$select)  url.searchParams.set("$select",  input.$select);
      if (input.$orderby) url.searchParams.set("$orderby", input.$orderby);
      if (input.$top != null)  url.searchParams.set("$top",  String(input.$top));
      if (input.$skip != null) url.searchParams.set("$skip", String(input.$skip));
      if (input.$expand)  url.searchParams.set("$expand",  input.$expand);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${t}`);
      }

      // Be tolerant if the API returns text
      const ctype = res.headers.get("content-type") || "";
      const out: unknown = ctype.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "");

      return OperationHandlerResult.success(out as ListUsersOutput);
    })
  );
