import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
const configure: any = (OperationHandlerSetup as any).configureHandler;const OperationHandlerSetupAny: any = OperationHandlerSetup;
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { RawHttpInput } from "./input.js";
import type { RawHttpOutput } from "./output.js";

function buildUrl(base: string, path: string, query?: Record<string, string | number | boolean | undefined>) {
  const u = new URL(path.startsWith("http") ? path : base.replace(/\/$/, "") + "/" + path.replace(/^\//, ""));
  if (query) for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null && v !== "") u.searchParams.append(k, String(v));
  return u.toString();
}

export const rawHttpHandler = OperationHandlerSetup
  configure("raw_http", (handler: any) =>
    handler.usingComposite(async (ctx: any, input: RawHttpInput) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const url = buildUrl(base, input.path, input.query);
      const headers = new Headers(input.headers ?? {});
      if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${ctx.auth!.user.access_token}`);
      if (!headers.has("Accept")) headers.set("Accept", "application/json");

      let body: BodyInit | undefined;
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

      const res = await fetch(url, { method: input.method, headers, body });
      if (!res.ok) throw new Error(`raw_http ${res.status}: ${await res.text().catch(()=> "")}`);

      const mode = (input as any).response ?? "json";
      if (mode === "text")  return OperationHandlerResult.success(await res.text());
      if (mode === "bytes") return OperationHandlerResult.success(Buffer.from(await res.arrayBuffer()).toString("base64"));

      const ctype = res.headers.get("content-type") || "";
      if (ctype.includes("application/json")) return OperationHandlerResult.success(await res.json());
      try { return OperationHandlerResult.success(await res.json()); } catch { return OperationHandlerResult.success(await res.text()); }
    })
  );






