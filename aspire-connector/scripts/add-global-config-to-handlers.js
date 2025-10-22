const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Adding GlobalConfig to ${operations.length} handlers...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(handlerPath)) continue;
  
  let content = fs.readFileSync(handlerPath, 'utf8');
  const originalContent = content;
  
  // Check if already has globalConfigHttp
  if (content.includes('withGlobalConfiguration') || content.includes('globalConfigHttp')) {
    continue;
  }
  
  // Add import for globalConfigHttp
  if (!content.includes("import { globalConfigHttp }")) {
    content = content.replace(
      "import { AspireConnectorAuth } from '../AspireConnectorAuth';",
      "import { AspireConnectorAuth } from '../AspireConnectorAuth';\nimport { globalConfigHttp } from '../GlobalConfig';"
    );
  }
  
  // Add .withGlobalConfiguration before .usingHttp
  content = content.replace(
    /handler\.usingHttp\(/g,
    'handler.withGlobalConfiguration(globalConfigHttp).usingHttp('
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(handlerPath, content);
    fixedCount++;
  }
}

console.log(`✅ Fixed ${fixedCount} handlers`);
console.log('\nHandlers now have GlobalConfig with base URL and auth!');
console.log('Tests should now connect to the API properly.');

