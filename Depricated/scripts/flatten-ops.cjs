// scripts/flatten-ops.cjs
/* eslint-disable no-console */
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const DRY_RUN = process.argv.includes("--dry-run");
const SRC = path.join(process.cwd(), "src");

function sanitize(name) {
  return name
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function newFlatName(relDir) {
  const parts = relDir.split(path.sep).filter(Boolean);
  if (parts.length === 1) return sanitize(parts[0]);
  if (parts.length >= 2) {
    const resource = sanitize(parts[0]);
    const op = sanitize(parts[1]);
    return `${op}_${resource}`;
  }
  return sanitize(relDir);
}

async function findOperationDirs(root) {
  const results = [];
  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name === "operation.json") {
        results.push(path.dirname(full));
      }
    }
  }
  await walk(root);
  results.sort((a, b) => b.length - a.length);
  return results;
}

async function moveFile(src, dest) {
  console.log("MOVE", path.relative(SRC, src), "->", path.relative(SRC, dest));
  if (DRY_RUN) return;
  await fsp.mkdir(path.dirname(dest), { recursive: true });
  await fsp.rename(src, dest);
}

async function patchAuthImports(filePath) {
  const exts = [".ts", ".tsx", ".js", ".cjs", ".mjs"];
  if (!exts.includes(path.extname(filePath))) return;
  let text = await fsp.readFile(filePath, "utf8");
  const before = text;

  text = text.replace(
    /from\s+['"]\.\.\/\.\.\/Auth(\.js)?['"]/g,
    `from "../Auth.js"`
  ).replace(
    /from\s+['"]\.\.\/Auth['"]/g,
    `from "../Auth.js"`
  );

  if (text !== before) {
    console.log("PATCH", path.relative(SRC, filePath), "(Auth import)");
    await fsp.writeFile(filePath, text, "utf8");
  }
}

async function removeIfEmpty(dir) {
  try {
    const contents = await fsp.readdir(dir);
    if (contents.length === 0) {
      await fsp.rmdir(dir);
    }
  } catch (_) { /* ignore */ }
}

async function run() {
  const opDirs = await findOperationDirs(SRC);
  if (opDirs.length === 0) {
    console.log("No operation.json files found under src/");
    return;
  }

  for (const absOld of opDirs) {
    const relOld = path.relative(SRC, absOld);
    const flat = newFlatName(relOld);
    const absNew = path.join(SRC, flat);

    if (relOld === flat) {
      console.log("SKIP (already flat):", relOld);
      continue;
    }

    console.log(`\n=== ${relOld} -> ${flat} ===`);
    if (DRY_RUN) {
      // Just show what we would move
      const files = await fsp.readdir(absOld, { withFileTypes: true });
      for (const e of files) {
        if (!e.isFile()) continue;
        const srcFile = path.join(absOld, e.name);
        const destFile = path.join(absNew, e.name);
        console.log("MOVE", path.relative(SRC, srcFile), "->", path.relative(SRC, destFile));
      }
      continue;
    }

    await fsp.mkdir(absNew, { recursive: true });

    const files = await fsp.readdir(absOld, { withFileTypes: true });
    for (const e of files) {
      if (!e.isFile()) continue;
      const srcFile = path.join(absOld, e.name);
      const destFile = path.join(absNew, e.name);
      await moveFile(srcFile, destFile);
    }

    // Only patch after real move
    const moved = await fsp.readdir(absNew, { withFileTypes: true });
    for (const e of moved) {
      if (!e.isFile()) continue;
      await patchAuthImports(path.join(absNew, e.name));
    }

    await removeIfEmpty(absOld);
    await removeIfEmpty(path.dirname(absOld));
  }

  console.log("\nDone.", DRY_RUN ? "(dry run: no files actually moved)" : "");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
