const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Applying array wrapping fix to all operations...\n`);

let fixedOutputs = 0;
let fixedHandlers = 0;
let fixedOutputJson = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const outputJsonPath = path.join(srcDir, opName, 'output.json');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(handlerPath)) continue;
  
  let outputContent = fs.readFileSync(outputPath, 'utf8');
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Check if output is an array type (ends with [])
  const isArrayOutput = outputContent.match(/export type (\w+)Output = (.+)\[\];/);
  if (!isArrayOutput) continue;
  
  const outputTypeName = isArrayOutput[1] + 'Output';
  const itemType = isArrayOutput[2].trim();
  
  console.log(`Fixing ${opName}...`);
  
  // 1. Update output.ts to wrap in object
  const newOutputContent = outputContent.replace(
    /export type (\w+)Output = (.+)\[\];/,
    'export type $1Output = {\n  items: $2[];\n};'
  );
  
  if (newOutputContent !== outputContent) {
    fs.writeFileSync(outputPath, newOutputContent);
    fixedOutputs++;
  }
  
  // 2. Update output.json
  if (fs.existsSync(outputJsonPath)) {
    const newOutputJson = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "items": {
          "type": "array",
          "items": { "type": "object" }
        }
      },
      "required": ["items"]
    };
    fs.writeFileSync(outputJsonPath, JSON.stringify(newOutputJson, null, 2));
    fixedOutputJson++;
  }
  
  // 3. Add OperationHandlerResult import to handler
  if (!handlerContent.includes('OperationHandlerResult')) {
    handlerContent = handlerContent.replace(
      "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';",
      "import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';\nimport { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';"
    );
  }
  
  // 4. Update handler.ts to use parseWithBodyAsText and wrap
  handlerContent = handlerContent.replace(
    /\.handleResponse\(\(_ctx, _input, response\) => \s*response\.parseWithBodyAsJson\(\)\s*\)/,
    `.handleResponse((_ctx, _input, response) => 
        response.parseWithBodyAsText((text) => 
          OperationHandlerResult.success({
            items: JSON.parse(text)
          })
        )
      )`
  );
  
  fs.writeFileSync(handlerPath, handlerContent);
  fixedHandlers++;
}

console.log(`\n✅ Fixed ${fixedOutputs} output types`);
console.log(`✅ Fixed ${fixedOutputJson} output.json files`);
console.log(`✅ Fixed ${fixedHandlers} handlers`);
console.log('\nAll array-returning operations now wrap responses properly!');
console.log('Run: tray-cdk connector build && npm test');

