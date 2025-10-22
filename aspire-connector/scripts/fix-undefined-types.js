const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Checking ${operations.length} operations for undefined types...\n`);

let fixedCount = 0;

for (const opName of operations) {
  const inputPath = path.join(srcDir, opName, 'input.ts');
  
  if (!fs.existsSync(inputPath)) continue;
  
  let content = fs.readFileSync(inputPath, 'utf8');
  const originalContent = content;
  
  // Find all AspireCloud type references that aren't defined in the file
  const typeRefs = content.match(/AspireCloud[\w]+/g);
  if (!typeRefs) continue;
  
  const uniqueTypeRefs = [...new Set(typeRefs)];
  
  // Check which types are actually defined
  const definedTypes = [];
  const typeDefinitions = content.match(/export type (AspireCloud[\w]+)/g);
  if (typeDefinitions) {
    for (const def of typeDefinitions) {
      const typeName = def.replace('export type ', '');
      definedTypes.push(typeName);
    }
  }
  
  // Find undefined types
  const undefinedTypes = uniqueTypeRefs.filter(t => !definedTypes.includes(t));
  
  if (undefinedTypes.length > 0) {
    console.log(`${opName}: Found ${undefinedTypes.length} undefined types`);
    
    for (const undefinedType of undefinedTypes) {
      // Replace type with any
      // Handle: TypeName[] | null
      content = content.replace(
        new RegExp(`${undefinedType}\\[\\] \\| null`, 'g'),
        'any[] | null'
      );
      // Handle: TypeName[]
      content = content.replace(
        new RegExp(`${undefinedType}\\[\\]`, 'g'),
        'any[]'
      );
      // Handle: TypeName | null
      content = content.replace(
        new RegExp(`${undefinedType} \\| null`, 'g'),
        'any | null'
      );
      // Handle: TypeName;
      content = content.replace(
        new RegExp(`${undefinedType};`, 'g'),
        'any;'
      );
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(inputPath, content);
      fixedCount++;
      console.log(`  ✅ Fixed ${opName}`);
    }
  }
}

console.log(`\n✅ Fixed ${fixedCount} operations with undefined types`);
console.log('\nNext: Run tray-cdk connector build to verify');

