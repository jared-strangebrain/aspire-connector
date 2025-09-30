// scripts/copy-operations.cjs
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src");
const DST = path.join(__dirname, "..", "dist");

function walk(dir, hits = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, hits);
    else if (e.isFile() && e.name === "operation.json") hits.push(full);
  }
  return hits;
}

for (const srcPath of walk(SRC)) {
  const rel = path.relative(SRC, srcPath);         // e.g. "contacts/list/operation.json"
  const dstPath = path.join(DST, rel);              // e.g. "dist/contacts/list/operation.json"
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  fs.copyFileSync(srcPath, dstPath);
  console.log("copied", rel);
}
