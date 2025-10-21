const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Wrapping array responses in handlers...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(handlerPath)) continue;
  
  const outputContent = fs.readFileSync(outputPath, 'utf8');
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Check if output is wrapped ({ items: ... })
  if (!outputContent.includes('{\n  items:')) continue;
  
  // Check if handler already has wrapping logic
  if (handlerContent.includes('items:') || handlerContent.includes('Array.isArray')) continue;
  
  // Add OperationHandlerResult import if needed
  if (!handlerContent.includes('OperationHandlerResult')) {
    handlerContent = handlerContent.replace(
      "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';",
      "import { OperationHandlerSetup, OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';"
    );
  }
  
  // Replace the simple handleResponse with wrapping logic
  const oldPattern = /\.handleResponse\(\(ctx, input, response\) => \s*response\.parseWithBodyAsJson\(\)\s*\)/;
  
  const newCode = `.handleResponse((ctx, input, response) => {
        const result = response.parseWithBodyAsJson<any>();
        if (result.isSuccess) {
          const arrayData = Array.isArray(result.value) ? result.value : [];
          return OperationHandlerResult.success({ items: arrayData });
        }
        return result;
      })`;
  
  handlerContent = handlerContent.replace(oldPattern, newCode);
  
  fs.writeFileSync(handlerPath, handlerContent);
  fixedCount++;
  console.log(`✅ Wrapped ${opName}`);
}

console.log(`\n✅ Wrapped ${fixedCount} handlers`);
console.log('\nHandlers now wrap array responses in objects.');
console.log('Run: npm test -- properties_get');

