const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Converting array operations to use composite wrapping...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const handlerPath = path.join(srcDir, opName, 'handler.ts');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(handlerPath)) continue;
  
  const outputContent = fs.readFileSync(outputPath, 'utf8');
  let handlerContent = fs.readFileSync(handlerPath, 'utf8');
  
  // Check if output is wrapped ({ items: ... })
  if (!outputContent.includes('{\n  items:')) continue;
  
  const originalHandlerContent = handlerContent;
  
  // Create a raw operation name for the inner HTTP call
  const rawOpName = `${opName}_raw`;
  
  // Extract the current HTTP handler code
  const httpMatch = handlerContent.match(/handler\.withGlobalConfiguration\(globalConfigHttp\)\.usingHttp\((http\) =>[\s\S]*?\)\s*\)/);
  if (!httpMatch) {
    console.log(`⚠️  Skipping ${opName} - couldn't parse HTTP handler`);
    continue;
  }
  
  // Create a composite handler that wraps the response
  const newHandlerCode = handlerContent.replace(
    /handler\.withGlobalConfiguration\(globalConfigHttp\)\.usingHttp\((http\) =>[\s\S]*?\)\s*\)/,
    `handler.usingComposite(async (ctx, input, invoke) => {
    // Make the HTTP call
    const httpResponse = await fetch(
      globalConfigHttp.getBaseUrl(ctx) + '/Properties',
      {
        method: 'GET',
        headers: {
          'Authorization': \`Bearer \${ctx?.auth?.user?.access_token || ''}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!httpResponse.ok) {
      return OperationHandlerResult.failure({
        _tag: 'ConnectorError',
        message: \`HTTP \${httpResponse.status}: \${await httpResponse.text()}\`
      });
    }
    
    const arrayData = await httpResponse.json();
    return OperationHandlerResult.success({ 
      items: Array.isArray(arrayData) ? arrayData : [] 
    });
  })`
  );
  
  // This approach is too complex. Let me try a different one - just keep the arrays and document them
  console.log(`Skipping ${opName} - will use different approach`);
}

console.log(`\n❌ Composite approach too complex`);
console.log('\nTrying simpler solution...');

