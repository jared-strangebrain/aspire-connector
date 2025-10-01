import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { CreateOpportunitiesInput } from "./input.js";
import type { CreateOpportunitiesOutput } from "./output.js";

export const createOpportunitiesHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, CreateOpportunitiesInput, CreateOpportunitiesOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Opportunities", base);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // keep consistent with your other create handlers
        body: JSON.stringify((input as any).body ?? {}),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

      // Be tolerant to either JSON or text payloads
      const ctype = res.headers.get("content-type") || "";
      const data = ctype.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "");

      return OperationHandlerResult.success(data as CreateOpportunitiesOutput);
    })
  );
