import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { VerifyConnectionInput } from "./input.js";
import type { VerifyConnectionOutput } from "./output.js";

export const verifyConnectionHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, VerifyConnectionInput, VerifyConnectionOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Contacts", base);
      if (input.$top != null) url.searchParams.set("$top", String(input.$top));
      if (input.$select) url.searchParams.set("$select", input.$select);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Verify connection failed (${res.status}): ${body}`);
      }

      // Be tolerant if the API ever returns text instead of JSON
      const ctype = res.headers.get("content-type") ?? "";
      const payload: unknown = ctype.includes("application/json")
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => "");

      return OperationHandlerResult.success(payload as VerifyConnectionOutput);
    })
  );
