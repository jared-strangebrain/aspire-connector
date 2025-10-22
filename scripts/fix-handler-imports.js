const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Fixing handler imports for ${operations.length} operations...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(handlerPath)) continue;
  
  let content = fs.readFileSync(handlerPath, 'utf8');
  const originalContent = content;
  
  // Fix the import path
  content = content.replace(
    "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';",
    "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';"
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(handlerPath, content);
    fixedCount++;
  }
}

console.log(`✅ Fixed ${fixedCount} handler files`);
console.log('\nHandlers should now compile correctly for tests!');

