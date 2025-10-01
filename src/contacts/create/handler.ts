import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../../Auth.js";
import type { CreateContactsInput } from "./input.js";
import type { CreateContactsOutput } from "./output.js";

export const createContactsHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, CreateContactsInput, CreateContactsOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = new URL("/api/Contacts", base);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.auth!.user.access_token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // some specs use { body: {...} }, others pass the object directly; support both
        body: JSON.stringify((input as any).body ?? input ?? {}),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

      const ctype = res.headers.get("content-type") || "";
      let data: unknown;

      if (ctype.includes("application/json")) {
        data = await res.json().catch(() => ({}));
      } else {
        // tolerate empty/no-json responses
        const text = await res.text().catch(() => "");
        data = text ? { message: text } : {};
      }

      return OperationHandlerResult.success(data as CreateContactsOutput);
    })
  );
