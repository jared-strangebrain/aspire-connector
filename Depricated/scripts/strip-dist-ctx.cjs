#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dist = path.resolve('dist');

function safeUnlink(p) {
  try { fs.unlinkSync(p); console.log(`removed ${path.relative(process.cwd(), p)}`); }
  catch (_) {}
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && e.name === 'test.ctx.json') safeUnlink(full);
  }
}

if (fs.existsSync(dist)) walk(dist);
