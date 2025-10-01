// scripts/copy-operations.cjs
// @ts-nocheck
'use strict';

/**
 * Copies `operation.json` and `test.ctx.json` from src/** to dist/**, preserving folders.
 */
const fs = require('fs');
const path = require('path');

const SRC_ROOT = path.join(process.cwd(), 'src');
const DIST_ROOT = path.join(process.cwd(), 'dist');
const FILENAMES = new Set(['operation.json', 'test.ctx.json']);

async function copyFilePreserveTree(srcAbs) {
  const rel = path.relative(SRC_ROOT, srcAbs);
  const destAbs = path.join(DIST_ROOT, rel);
  await fs.promises.mkdir(path.dirname(destAbs), { recursive: true });
  await fs.promises.copyFile(srcAbs, destAbs);
  console.log(
    `copied ${rel.replace(/\\/g, '/')} -> ${path
      .relative(DIST_ROOT, destAbs)
      .replace(/\\/g, '/')}`
  );
}

async function walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && FILENAMES.has(entry.name)) {
      await copyFilePreserveTree(full);
    }
  }
}

(async () => {
  await fs.promises.mkdir(DIST_ROOT, { recursive: true });
  await walk(SRC_ROOT);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
