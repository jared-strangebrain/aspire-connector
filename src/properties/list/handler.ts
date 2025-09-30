import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
const configure: any = (OperationHandlerSetup as any).configureHandler;const OperationHandlerSetupAny: any = OperationHandlerSetup;
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { ListPropertiesInput } from "./input.js";
import type { ListPropertiesOutput } from "./output.js";

export const listPropertiesHandler = OperationHandlerSetup
  configure("properties.list", (handler: any) =>
    handler.usingComposite(async (ctx: any, input: ListPropertiesInput) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Properties", base);
      const q: any = input as any;
      if (q.$filter)  url.searchParams.set("$filter",  q.$filter);
      if (q.$select)  url.searchParams.set("$select",  q.$select);
      if (q.$orderby) url.searchParams.set("$orderby", q.$orderby);
      if (q.$top != null)  url.searchParams.set("$top",  String(q.$top));
      if (q.$skip != null) url.searchParams.set("$skip", String(q.$skip));
      if (q.$expand)  url.searchParams.set("$expand",  q.$expand);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Authorization": `Bearer ${ctx.auth!.user.access_token}`, "Accept": "application/json" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(()=> "")}`);
      const data = await res.json();
      return OperationHandlerResult.success(data as ListPropertiesOutput);
    })
  );






