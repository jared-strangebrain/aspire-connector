const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Fixing handleResponse signatures...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(handlerPath)) continue;
  
  let content = fs.readFileSync(handlerPath, 'utf8');
  const originalContent = content;
  
  // Fix single-parameter form to 3-parameter form
  content = content.replace(
    /\.handleResponse\(\(response\) => \{[\s\S]*?return httpResponseBody;\s*\}\)/g,
    `.handleResponse((_ctx, _input, response) => 
        response.parseWithBodyAsText((text) => 
          OperationHandlerResult.success({
            items: JSON.parse(text)
          })
        )
      )`
  );
  
  // Also fix any remaining simple parseWithBodyAsJson for array operations
  if (content.includes('items:')) {
    content = content.replace(
      /\.handleResponse\(\(_ctx, _input, response\) => \s*response\.parseWithBodyAsJson\(\)\s*\)/g,
      `.handleResponse((_ctx, _input, response) => 
        response.parseWithBodyAsText((text) => 
          OperationHandlerResult.success({
            items: JSON.parse(text)
          })
        )
      )`
    );
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(handlerPath, content);
    fixedCount++;
  }
}

console.log(`✅ Fixed ${fixedCount} handlers`);
console.log('\nAll handlers now use correct 3-parameter signature');
console.log('Run: npm test');

