import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import type { AspireAuth } from "../Auth.js";
import type { RawHttpInput } from "./input.js";
import type { RawHttpOutput } from "./output.js";

function buildUrl(
  base: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined>
) {
  const u = new URL(
    path.startsWith("http")
      ? path
      : base.replace(/\/$/, "") + "/" + path.replace(/^\//, "")
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        u.searchParams.append(k, String(v));
      }
    }
  }
  return u.toString();
}

type MaybeBodies = {
  json?: unknown;
  text?: string;
  base64?: string;
  response?: "json" | "text" | "bytes";
};

export const rawHttpHandler = OperationHandlerSetup
  .configureHandler<AspireAuth, RawHttpInput, RawHttpOutput>((handler) =>
    handler.usingComposite(async (ctx, input) => {
      const base = ctx?.auth?.user?.base_url;
      if (!base) throw new Error("Missing base_url in auth context");

      const i = input as RawHttpInput & MaybeBodies;
      const url = buildUrl(base, i.path, i.query);

      const headers = new Headers(i.headers ?? {});
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${ctx.auth!.user.access_token}`);
      }
      if (!headers.has("Accept")) headers.set("Accept", "application/json");

      let body: BodyInit | undefined;
      if (i.json !== undefined) {
        if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
        body = JSON.stringify(i.json);
      } else if (i.text !== undefined) {
        if (!headers.has("Content-Type")) headers.set("Content-Type", "text/plain");
        body = i.text;
      } else if (i.base64 !== undefined) {
        if (!headers.has("Content-Type")) headers.set("Content-Type", "application/octet-stream");
        const b = Buffer.from(i.base64, "base64");
        body = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
      }

      const res = await fetch(url, { method: i.method, headers, body });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`raw_http ${res.status}: ${t}`);
      }

      const mode = i.response ?? "json";
      if (mode === "text") {
        const t = await res.text();
        return OperationHandlerResult.success(t as RawHttpOutput);
      }
      if (mode === "bytes") {
        const buf = Buffer.from(await res.arrayBuffer());
        return OperationHandlerResult.success(buf.toString("base64") as RawHttpOutput);
      }

      // default: JSON if possible, otherwise text
      const ctype = res.headers.get("content-type") || "";
      if (ctype.includes("application/json")) {
        const j = await res.json().catch(() => ({}));
        return OperationHandlerResult.success(j as RawHttpOutput);
      }
      try {
        const j = await res.json();
        return OperationHandlerResult.success(j as RawHttpOutput);
      } catch {
        const t = await res.text().catch(() => "");
        return OperationHandlerResult.success(t as RawHttpOutput);
      }
    })
  );
