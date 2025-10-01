import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { CreateTasksInput } from "./input.js";
import type { CreateTasksOutput } from "./output.js";

type MaybeBody = { body?: unknown };

export const createTasksHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, CreateTasksInput, CreateTasksOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Tasks", base);
      const payload = (input as unknown as MaybeBody).body ?? {};

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${t}`);
      }

      // Some Aspire endpoints return JSON, some return plain text/ID
      const ctype = res.headers.get("content-type") || "";
      const out: unknown = ctype.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "");

      return OperationHandlerResult.success(out as CreateTasksOutput);
    })
  );
