const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Fixing test imports for ${operations.length} operations...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const testPath = path.join(srcDir, opName, 'handler.test.ts');
  
  if (!fs.existsSync(testPath)) continue;
  
  let content = fs.readFileSync(testPath, 'utf8');
  const originalContent = content;
  
  // Fix the import path
  content = content.replace(
    "import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';",
    "import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';\nimport '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';"
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(testPath, content);
    fixedCount++;
  }
}

console.log(`✅ Fixed ${fixedCount} test files`);
console.log('\nTests should now compile correctly!');
console.log('Run: npm test');

