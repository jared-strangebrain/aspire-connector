// scripts/copy-operations.cjs
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const SRC = path.resolve("src");
const DIST = path.resolve("dist");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return false;
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
  console.log(`copied ${path.relative(process.cwd(), from).replace(/\\/g,'/')}`
    + ` -> ${path.relative(process.cwd(), to).replace(/\\/g,'/')}`);
  return true;
}

function copyOp(opDir) {
  const opName = path.basename(opDir);
  const srcOpJson = path.join(opDir, "operation.json");
  const srcCtxJson = path.join(opDir, "test.ctx.json");

  const distOpDir = path.join(DIST, opName);
  const distOpJson = path.join(distOpDir, "operation.json");
  const distCtxJson = path.join(distOpDir, "test.ctx.json");

  // operation.json (required for build/deploy)
  copyIfExists(srcOpJson, distOpJson);

  // test.ctx.json (optional but required by OperationHandlerTest during jest)
  copyIfExists(srcCtxJson, distCtxJson);
}

function main() {
  ensureDir(DIST);

  // Iterate over immediate subdirs of src that look like operations
  const entries = fs.readdirSync(SRC, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const opDir = path.join(SRC, e.name);
    // Treat any dir containing operation.json as an operation
    if (fs.existsSync(path.join(opDir, "operation.json"))) {
      copyOp(opDir);
    }
  }

  // If you keep a root-level test.ctx.json for anything, copy it to dist root:
  copyIfExists(path.join(SRC, "test.ctx.json"), path.join(DIST, "test.ctx.json"));
}

main();
