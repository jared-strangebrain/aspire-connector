const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Reverting all array wrapping changes...\n`);

let fixedOutputs = 0;
let fixedHandlers = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const outputJsonPath = path.join(srcDir, opName, 'output.json');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  // Revert output.ts from wrapped to array
  if (fs.existsSync(outputPath)) {
    let outputContent = fs.readFileSync(outputPath, 'utf8');
    const originalOutputContent = outputContent;
    
    // Change from wrapped object back to array
    outputContent = outputContent.replace(
      /export type (\w+)Output = \{\n  items: (.+)\[\];\n\};/,
      'export type $1Output = $2[];'
    );
    
    if (outputContent !== originalOutputContent) {
      fs.writeFileSync(outputPath, outputContent);
      fixedOutputs++;
    }
  }
  
  // Revert output.json
  if (fs.existsSync(outputJsonPath)) {
    let jsonContent = fs.readFileSync(outputJsonPath, 'utf8');
    try {
      const json = JSON.parse(jsonContent);
      if (json.type === 'object' && json.properties && json.properties.items) {
        // Change back to simple array schema
        const newJson = {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "type": "array",
          "items": { "type": "object" }
        };
        fs.writeFileSync(outputJsonPath, JSON.stringify(newJson, null, 2));
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }
  
  // Revert handler.ts to simple parseWithBodyAsJson
  if (fs.existsSync(handlerPath)) {
    let handlerContent = fs.readFileSync(handlerPath, 'utf8');
    const originalHandlerContent = handlerContent;
    
    // Remove OperationHandlerResult import
    handlerContent = handlerContent.replace(
      /import \{ OperationHandlerResult \} from '@trayio\/cdk-dsl\/connector\/operation\/OperationHandler';\n/g,
      ''
    );
    
    // Revert to simple handleResponse
    handlerContent = handlerContent.replace(
      /\.handleResponse\(\(_ctx, _input, response\) => \{[\s\S]*?return httpResponseBody;\s*\}\)/,
      `.handleResponse((_ctx, _input, response) => 
        response.parseWithBodyAsJson()
      )`
    );
    
    if (handlerContent !== originalHandlerContent) {
      fs.writeFileSync(handlerPath, handlerContent);
      fixedHandlers++;
    }
  }
}

console.log(`\n✅ Reverted ${fixedOutputs} output types to arrays`);
console.log(`✅ Reverted ${fixedHandlers} handlers to simple parseWithBodyAsJson`);
console.log('\nBack to simple implementation.');
console.log('Arrays will remain as-is - Tray runtime may handle them.');

