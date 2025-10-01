// @ts-nocheck
// // scripts/copy-operations.cjs
/* Copy every src/**operation.json into the corresponding dist/** folder (same structure) */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

async function main() {
  const SRC_ROOT = path.join(process.cwd(), 'src');
  const DIST_ROOT = path.join(process.cwd(), 'dist');

  async function walk(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile() && e.name === 'operation.json') {
        const rel = path.relative(SRC_ROOT, full); // e.g. "contacts/create/operation.json"
        const dest = path.join(DIST_ROOT, rel);    // -> "dist/contacts/create/operation.json"
        await fsp.mkdir(path.dirname(dest), { recursive: true });
        await fsp.copyFile(full, dest);
        console.log(`copied ${path.relative(SRC_ROOT, full)} -> ${path.relative(DIST_ROOT, dest)}`);
      }
    }
  }

  // Ensure dist exists
  await fsp.mkdir(DIST_ROOT, { recursive: true });
  await walk(SRC_ROOT);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
