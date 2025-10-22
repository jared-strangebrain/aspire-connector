const fs = require('fs');
const path = require('path');

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Simplifying output types to use any for compatibility...\n');

let successCount = 0;
let failCount = 0;

for (const op of operations) {
  try {
    const opDir = path.join(__dirname, '..', 'src', op.name);
    
    if (!fs.existsSync(opDir)) {
      console.log(`⏭️  Skipping ${op.name} (directory not found)`);
      continue;
    }

    const typeName = op.name.split('_').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join('');

    // Create simple output type
    const outputContent = `export type ${typeName}Output = any;\n`;
    fs.writeFileSync(path.join(opDir, 'output.ts'), outputContent);

    successCount++;
    console.log(`✅ Simplified ${op.name}`);
  } catch (error) {
    failCount++;
    console.error(`❌ Failed to simplify ${op.name}: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log('='.repeat(60));

