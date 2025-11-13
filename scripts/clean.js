const fs = require('fs');
const path = require('path');

const projectRoot = __dirname ? path.resolve(__dirname, '..') : process.cwd();

const distPath = path.join(projectRoot, 'dist');
const tsBuildInfoPath = path.join(projectRoot, 'tsconfig.tsbuildinfo');

try {
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
} catch (error) {
  console.error(`Failed to remove dist directory: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
}

try {
  if (fs.existsSync(tsBuildInfoPath)) {
    fs.rmSync(tsBuildInfoPath, { force: true });
  }
} catch (error) {
  console.error(`Failed to remove tsconfig.tsbuildinfo: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
}

