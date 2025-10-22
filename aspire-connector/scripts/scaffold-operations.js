const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log(`Scaffolding ${operations.length} operations...\n`);

let successCount = 0;
let failCount = 0;
const failed = [];

// Skip the sample get_post operation if it exists
const existingOps = ['get_post'];

for (const op of operations) {
  if (existingOps.includes(op.name)) {
    console.log(`⏭️  Skipping ${op.name} (already exists)`);
    continue;
  }

  try {
    console.log(`Creating operation: ${op.name}...`);
    
    // Run the CLI command to add the operation
    execSync(`tray-cdk connector add-operation ${op.name} http`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    successCount++;
    console.log(`✅ Created ${op.name}`);
  } catch (error) {
    failCount++;
    failed.push(op.name);
    console.error(`❌ Failed to create ${op.name}: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
if (failed.length > 0) {
  console.log(`\nFailed operations:`);
  failed.forEach(name => console.log(`  - ${name}`));
}
console.log('='.repeat(60));

