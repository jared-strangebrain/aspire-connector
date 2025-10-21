const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Checking ${operations.length} operations for array outputs...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(handlerPath)) continue;
  
  let outputContent = fs.readFileSync(outputPath, 'utf8');
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Check if output is an array type (ends with [])
  const outputTypeMatch = outputContent.match(/export type (\w+)Output = (.+);/);
  if (!outputTypeMatch) continue;
  
  const outputTypeName = outputTypeMatch[1] + 'Output';
  const outputType = outputTypeMatch[2].trim();
  
  // Skip if already wrapped or not an array
  if (outputType.includes('{') || !outputType.includes('[]')) continue;
  
  console.log(`Wrapping array output for: ${opName}`);
  
  // Update output.ts to wrap in object
  const newOutputContent = outputContent.replace(
    /export type (\w+)Output = (.+)\[\];/,
    'export type $1Output = {\n  items: $2[];\n};'
  );
  
  // Update handler.ts to wrap the response
  const newHandlerContent = handlerContent.replace(
    /\.handleResponse\(\(ctx, input, response\) => \s*response\.parseWithBodyAsJson\(\)\s*\)/,
    `.handleResponse((ctx, input, response) => {
        const result = response.parseWithBodyAsJson();
        if (result.isSuccess && Array.isArray(result.value)) {
          return {
            isSuccess: true,
            isFailure: false,
            value: { items: result.value }
          };
        }
        return result;
      })`
  );
  
  if (newOutputContent !== outputContent) {
    fs.writeFileSync(outputPath, newOutputContent);
    fixedCount++;
  }
  
  if (newHandlerContent !== handlerContent) {
    fs.writeFileSync(handlerPath, newHandlerContent);
  }
}

console.log(`\n✅ Wrapped ${fixedCount} array outputs`);
console.log('\nOperations now return objects instead of arrays.');
console.log('Tests should now pass!');

