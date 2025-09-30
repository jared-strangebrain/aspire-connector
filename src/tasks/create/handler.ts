import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
const configure: any = (OperationHandlerSetup as any).configureHandler;const OperationHandlerSetupAny: any = OperationHandlerSetup;
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { CreateTasksInput } from "./input.js";
import type { CreateTasksOutput } from "./output.js";

export const createTasksHandler = OperationHandlerSetup
  configure("tasks.create", (handler: any) =>
    handler.usingComposite(async (ctx: any, input: CreateTasksInput) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Tasks", base);
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ctx.auth!.user.access_token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify((input as any).body ?? {})
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(()=> "")}`);
      const text = await res.text();
      return OperationHandlerResult.success(text as any as CreateTasksOutput);
    })
  );






