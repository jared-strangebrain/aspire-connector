import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
const configure: any = (OperationHandlerSetup as any).configureHandler;const OperationHandlerSetupAny: any = OperationHandlerSetup;
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { VerifyConnectionInput } from "./input.js";
import type { VerifyConnectionOutput } from "./output.js";

export const verifyConnectionHandler = OperationHandlerSetup
  configure("verify_connection", (handler: any) =>
    handler.usingComposite(async (ctx: any, input: VerifyConnectionInput) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Contacts", base);
      url.searchParams.set("$top", String(input.$top ?? 1));
      if (input.$select) url.searchParams.set("$select", input.$select);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: { "Authorization": `Bearer ${ctx.auth!.user.access_token}`, "Accept": "application/json" }
      });
      if (!res.ok) throw new Error(`Verify connection failed (${res.status}): ${await res.text().catch(()=> "")}`);
      const data = await res.json();
      return OperationHandlerResult.success(data as VerifyConnectionOutput);
    })
);






