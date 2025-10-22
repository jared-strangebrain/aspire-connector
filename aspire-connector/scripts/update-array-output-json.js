const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Updating output.json for wrapped array outputs...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const outputPath = path.join(srcDir, opName, 'output.ts');
  const outputJsonPath = path.join(srcDir, opName, 'output.json');
  
  if (!fs.existsSync(outputPath) || !fs.existsSync(outputJsonPath)) continue;
  
  const outputContent = fs.readFileSync(outputPath, 'utf8');
  
  // Check if output is wrapped ({ items: ... })
  if (outputContent.includes('{\n  items:')) {
    // Update output.json to reflect wrapped structure
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
    fixedCount++;
  }
}

console.log(`✅ Updated ${fixedCount} output.json files`);
console.log('\nRun: tray-cdk connector build');

