const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Fixing array responses properly...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(handlerPath)) continue;
  
  const outputContent = fs.readFileSync(outputPath, 'utf8');
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Check if output is wrapped ({ items: ... })
  if (!outputContent.includes('{\n  items:')) continue;
  
  // Replace the handleResponse to use parseWithBodyAsText and manually wrap
  const oldPattern = /\.handleResponse\(\(ctx, input, response\) => \{[\s\S]*?return result;\s*\}\)/;
  
  const newCode = `.handleResponse((ctx, input, response) =>
        response.parseWithBodyAsText((text) => {
          const arrayData = JSON.parse(text);
          return { items: Array.isArray(arrayData) ? arrayData : [] };
        })
      )`;
  
  handlerContent = handlerContent.replace(oldPattern, newCode);
  
  // Also remove OperationHandlerResult import if added
  handlerContent = handlerContent.replace(
    "import { OperationHandlerSetup, OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';",
    "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';"
  );
  
  fs.writeFileSync(handlerPath, handlerContent);
  fixedCount++;
}

console.log(`\n✅ Fixed ${fixedCount} handlers to properly wrap array responses`);
console.log('\nHandlers now use parseWithBodyAsText to manually wrap arrays.');
console.log('Run: npm test -- properties_get');

