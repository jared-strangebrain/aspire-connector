const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Fixing invalid test filters...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const testPath = path.join(srcDir, opName, 'handler.test.ts');
  
  if (!fs.existsSync(testPath)) continue;
  
  let content = fs.readFileSync(testPath, 'utf8');
  const originalContent = content;
  
  // Replace invalid filter values in second test case
  // Change from invalid syntax to simple valid parameter
  content = content.replace(
    /\.when\(\(ctx, testContext\) => \(\{\s*select: 'optional-value',\s*filter: 'optional-value',\s*expand: 'optional-value'\s*\}\)\)/g,
    `.when((ctx, testContext) => ({
            top: '10',  // Limit to 10 results
            orderby: 'ModifiedDate desc'  // Order by most recent
          }))`
  );
  
  // Also fix standalone filter lines
  content = content.replace(
    /filter: 'optional-value'/g,
    "// filter: 'Active eq true'  // Example valid filter (commented out)"
  );
  
  content = content.replace(
    /select: 'optional-value'/g,
    "// select: 'ID,Name'  // Example field selection (commented out)"
  );
  
  content = content.replace(
    /expand: 'optional-value'/g,
    "// expand: 'RelatedEntity'  // Example expand (commented out)"
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(testPath, content);
    fixedCount++;
  }
}

console.log(`✅ Fixed ${fixedCount} test files`);
console.log('\nInvalid OData filters removed');
console.log('Tests now use valid parameters (top, orderby)');
console.log('\nRun: tray-cdk connector test');

