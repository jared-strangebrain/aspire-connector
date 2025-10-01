// src/create_contacts/handler.ts
import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { CreateContactsInput } from "./input.js";
import type { CreateContactsOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

// minimal ctx shape for what we read
type Ctx = { auth?: { user?: AspireAuth["user"] } };

const impl = async (ctx: Ctx, input: CreateContactsInput) => {
  const base = ctx?.auth?.user?.base_url;
  if (!base) throw new Error("Missing base_url in auth context");

  const url = new URL("/api/Contacts", base);
  // support both `{ body: {...} }` and direct object payloads
  const payload = (input as { body?: unknown }).body ?? (input as unknown) ?? {};

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ctx!.auth!.user!.access_token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  // tolerant parse: prefer JSON, fall back to text
  const ctype = res.headers.get("content-type") || "";
  const out: unknown = ctype.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().then(t => (t ? { message: t } : {})).catch(() => ({}));

  return OperationHandlerResult.success(out as CreateContactsOutput);
};

// Export plain function in tests; CDK-wired handler at runtime
export const createContactsHandler = IS_TEST
  ? impl
  : OperationHandlerSetup
      .configureHandler<AspireAuth, CreateContactsInput, CreateContactsOutput>((handler) =>
        handler.usingComposite(impl as any)
      );
