import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { RawHttpInput } from "./input.js";
import type { RawHttpOutput } from "./output.js";

const IS_TEST = !!process.env.JEST_WORKER_ID;

// Minimal context type that matches how we read it in code/tests
type Ctx = { auth?: { user?: AspireAuth["user"] } };

function buildUrl(
  base: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined | null>
): string {
  const root = base.replace(/\/$/, "");
  const rel  = String(path || "").replace(/^\//, "");
  const url  = new URL(/^https?:\/\//i.test(path) ? path : `${root}/${rel}`);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, String(v));
    }
  }
  return url.toString();
}

const impl = async (ctx: Ctx, input: RawHttpInput) => {
  const base = ctx?.auth?.user?.base_url;
  if (!base) throw new Error("Missing base_url in auth context");

  const url = buildUrl(base, (input as any).path ?? "", (input as any).query);

  // Merge headers (user-provided wins except we always provide Authorization if missing)
  const headers = new Headers((input as any).headers ?? {});
  if (!headers.has("Authorization") && ctx?.auth?.user?.access_token) {
    headers.set("Authorization", `Bearer ${ctx.auth!.user!.access_token}`);
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  let body: BodyInit | undefined;

  // Choose body based on which field is present. (json | text | base64)
  if ((input as any).json !== undefined) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify((input as any).json);
  } else if ((input as any).text !== undefined) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "text/plain");
    body = (input as any).text;
  } else if ((input as any).base64 !== undefined) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/octet-stream");
    const b = Buffer.from((input as any).base64, "base64");
    body = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
  }

  const res = await fetch(url, { method: (input as any).method, headers, body });
  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`raw_http ${res.status}: ${errBody}`);
  }

  // Response mode: default "json", optional "text" | "bytes"
  const mode = (input as any).response ?? "json";
  if (mode === "text") {
    const text = await res.text();
    return OperationHandlerResult.success(text as RawHttpOutput);
  }
  if (mode === "bytes") {
    const buf = Buffer.from(await res.arrayBuffer());
    return OperationHandlerResult.success(buf.toString("base64") as RawHttpOutput);
  }

  // Default: try JSON; if it isn’t JSON, fall back to text
  const ctype = res.headers.get("content-type") || "";
  if (ctype.includes("application/json")) {
    const json = await res.json().catch(() => ({}));
    return OperationHandlerResult.success(json as RawHttpOutput);
  }
  try {
    const json = await res.json();
    return OperationHandlerResult.success(json as RawHttpOutput);
  } catch {
    const text = await res.text().catch(() => "");
    return OperationHandlerResult.success(text as unknown as RawHttpOutput);
  }
};

// Export in a way that works for both tests and runtime
export const rawHttpHandler = IS_TEST
  ? impl
  : OperationHandlerSetup
      .configureHandler<AspireAuth, RawHttpInput, RawHttpOutput>((handler) =>
        handler.usingComposite(impl as any) // impl uses a local Ctx type; CDK will supply its runtime context
      );
