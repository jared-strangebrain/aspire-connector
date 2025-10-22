const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Properly wrapping array responses...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(handlerPath)) continue;
  
  const outputContent = fs.readFileSync(outputPath, 'utf8');
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Check if output is wrapped ({ items: ... })
  if (!outputContent.includes('{\n  items:')) continue;
  
  // Add OperationHandlerResult import
  if (!handlerContent.includes('OperationHandlerResult')) {
    handlerContent = handlerContent.replace(
      "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';",
      "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';\nimport { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';"
    );
  }
  
  // Replace handleResponse to properly wrap array
  const oldPattern = /\.handleResponse\(\(ctx, input, response\) =>\s*response\.parseWithBodyAsText\(\(text\) => \{[\s\S]*?\}\)\s*\)/;
  
  const newCode = `.handleResponse((ctx, input, response) => {
        const httpResponseBody = response.parseWithBodyAsJson<any>();
        if (httpResponseBody.isSuccess) {
          const arrayData = httpResponseBody.value;
          return OperationHandlerResult.success({ 
            items: Array.isArray(arrayData) ? arrayData : [] 
          });
        }
        return httpResponseBody;
      })`;
  
  handlerContent = handlerContent.replace(oldPattern, newCode);
  
  fs.writeFileSync(handlerPath, handlerContent);
  fixedCount++;
}

console.log(`\n✅ Fixed ${fixedCount} handlers`);
console.log('\nHandlers now properly wrap arrays using OperationHandlerResult.success()');
console.log('Run: npm test -- properties_get');

