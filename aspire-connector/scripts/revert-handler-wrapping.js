const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Reverting handler wrapping for ${operations.length} operations...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(handlerPath)) continue;
  
  let content = fs.readFileSync(handlerPath, 'utf8');
  const originalContent = content;
  
  // Revert the wrapping code back to simple parseWithBodyAsJson
  content = content.replace(
    /\.handleResponse\(\(ctx, input, response\) => \{\s*const result = response\.parseWithBodyAsJson\(\);[\s\S]*?return result;\s*\}\)/g,
    `.handleResponse((ctx, input, response) => 
        response.parseWithBodyAsJson()
      )`
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(handlerPath, content);
    fixedCount++;
  }
}

console.log(`✅ Reverted ${fixedCount} handlers to simple response handling`);
console.log('\nHandlers now use standard parseWithBodyAsJson()');
console.log('Output types handle the wrapping instead.');

