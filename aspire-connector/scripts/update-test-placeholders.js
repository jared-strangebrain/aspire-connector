const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Get all operation directories
const operations = fs.readdirSync(srcDir).filter(item => {
  const itemPath = path.join(srcDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Updating test placeholders for ${operations.length} operations...\n`);

let updatedCount = 0;

for (const opName of operations) {
  const testPath = path.join(srcDir, opName, 'handler.test.ts');
  
  if (!fs.existsSync(testPath)) continue;
  
  let content = fs.readFileSync(testPath, 'utf8');
  const originalContent = content;
  
  // Check if it has placeholders
  if (!content.includes('/* TODO:') && !content.includes('/* Request body fields */')) {
    continue;
  }
  
  // Read input.ts to understand required fields
  const inputPath = path.join(srcDir, opName, 'input.ts');
  const inputContent = fs.readFileSync(inputPath, 'utf8');
  
  // Determine operation type from name
  const isGet = opName.includes('_get');
  const isPost = opName.includes('_create') || opName.includes('_post');
  const isPut = opName.includes('_update') || opName.includes('_put');
  const isDelete = opName.includes('_delete');
  
  // Check if body is required
  const hasRequiredBody = inputContent.match(/body:\s*\w+;/) !== null;
  const hasOptionalBody = inputContent.match(/body\?:\s*\w+;/) !== null;
  const hasBody = hasRequiredBody || hasOptionalBody;
  
  // Check if ID is required
  const hasRequiredId = inputContent.match(/\s+id:\s*(string|number);/) !== null;
  
  // Get body type name if exists
  let bodyTypeName = null;
  const bodyTypeMatch = inputContent.match(/body\??\s*:\s*(\w+);/);
  if (bodyTypeMatch) {
    bodyTypeName = bodyTypeMatch[1];
  }
  
  // Get required fields from body type if we can find it
  let requiredFields = [];
  if (bodyTypeName && inputContent.includes(`export type ${bodyTypeName}`)) {
    const typeDefMatch = inputContent.match(new RegExp(`export type ${bodyTypeName} = \\{([^}]+)\\}`, 's'));
    if (typeDefMatch) {
      const typeBody = typeDefMatch[1];
      // Find required fields (ones without ?)
      const fieldMatches = typeBody.matchAll(/^\s*(\w+):\s*([\w|[\]<>, ]+);/gm);
      for (const match of fieldMatches) {
        const fieldName = match[1];
        const fieldType = match[2];
        requiredFields.push({ name: fieldName, type: fieldType });
      }
    }
  }
  
  // Generate test data based on operation type
  let testData = {};
  
  if (hasBody && requiredFields.length > 0) {
    // Build minimal body with required fields
    const bodyObj = {};
    for (const field of requiredFields) {
      // Generate appropriate value based on type
      if (field.type.includes('string')) {
        // Special handling for known fields
        if (field.name.toLowerCase().includes('email')) {
          bodyObj[field.name] = 'test@example.com';
        } else if (field.name.toLowerCase().includes('phone')) {
          bodyObj[field.name] = '555-0100';
        } else if (field.name.toLowerCase().includes('firstname')) {
          bodyObj[field.name] = 'Test';
        } else if (field.name.toLowerCase().includes('lastname')) {
          bodyObj[field.name] = 'User';
        } else if (field.name.toLowerCase().includes('name')) {
          bodyObj[field.name] = 'Test Name';
        } else if (field.name.toLowerCase().includes('date')) {
          bodyObj[field.name] = '2025-01-15T00:00:00Z';
        } else {
          bodyObj[field.name] = 'test-value';
        }
      } else if (field.type.includes('number') || field.type.includes('integer')) {
        // Use 1 for most numeric fields, could be IDs
        bodyObj[field.name] = 1;
      } else if (field.type.includes('boolean')) {
        bodyObj[field.name] = true;
      } else if (field.type.includes('any')) {
        bodyObj[field.name] = {};
      } else {
        // Default for complex types
        bodyObj[field.name] = {};
      }
    }
    testData.body = bodyObj;
  } else if (hasBody) {
    // Body required but couldn't parse fields, use generic
    testData.body = {
      // NOTE: Update with actual required fields for your API
    };
  }
  
  if (hasRequiredId) {
    testData.id = 1; // Will need to be replaced with actual ID
  }
  
  // Format test data as string
  let testDataStr = '';
  if (Object.keys(testData).length === 0) {
    testDataStr = '{}';
  } else {
    const entries = Object.entries(testData);
    const lines = entries.map(([key, value]) => {
      if (key === 'body') {
        if (Object.keys(value).length === 0) {
          return `            ${key}: { /* NOTE: Add required fields based on your API */ }`;
        }
        const bodyLines = Object.entries(value).map(([k, v]) => {
          if (typeof v === 'string') {
            return `              ${k}: '${v}'`;
          } else if (typeof v === 'object' && Object.keys(v).length === 0) {
            return `              ${k}: {}`;
          } else {
            return `              ${k}: ${JSON.stringify(v)}`;
          }
        }).join(',\n');
        return `            ${key}: {\n${bodyLines}\n            }`;
      } else {
        return `            ${key}: ${JSON.stringify(value)}`;
      }
    }).join(',\n');
    testDataStr = `{\n${lines}\n          }`;
  }
  
  // Add helpful comment based on operation type
  let comment = '';
  if (isGet) {
    comment = '// GET operation - no required inputs, can add optional filters\n          ';
  } else if (isPost || isPut) {
    comment = '// NOTE: May need to update IDs and values for your specific API instance\n          ';
  } else if (isDelete) {
    comment = '// NOTE: Replace ID with actual resource ID from your system\n          ';
  }
  
  // Replace the first test case placeholder
  content = content.replace(
    /\.when\(\(ctx, testContext\) => \({[\s\S]*?body: \{ \/\* TODO: Add required body fields \*\/ \}[\s\S]*?\}\)\)/,
    `.when((ctx, testContext) => (${comment}${testDataStr}))`
  );
  
  // Also replace simpler placeholder pattern
  content = content.replace(
    /\.when\(\(ctx, testContext\) => \({[\s\S]*?body: \{ \/\* Request body fields \*\/ \}[\s\S]*?\}\)\)/,
    `.when((ctx, testContext) => (${comment}${testDataStr}))`
  );
  
  // Replace second test case - add one optional parameter if available
  let testData2Str = testDataStr;
  if (isGet && !testDataStr.includes('filter')) {
    // For GET operations, add a filter parameter
    if (testDataStr === '{}') {
      testData2Str = `{\n            // Example: Add OData filter\n            // filter: 'Active eq true'\n          }`;
    }
  }
  
  // Replace the second test case (look for the pattern after "all inputs including optional")
  const secondTestMatch = content.match(/(\.testCase\('should succeed with all inputs including optional parameters'[\s\S]*?\.when\(\(ctx, testContext\) => \()\{[\s\S]*?\}\)(\)[\s\S]*?\.then)/);
  if (secondTestMatch) {
    const replacement = `${secondTestMatch[1]}${comment}${testData2Str})${secondTestMatch[2]}`;
    content = content.replace(secondTestMatch[0], replacement);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(testPath, content);
    updatedCount++;
    console.log(`✅ Updated ${opName}`);
  }
}

console.log(`\n✅ Updated ${updatedCount} test files`);
console.log('\nNOTE: Tests now have minimal valid data, but you may need to:');
console.log('1. Replace placeholder IDs with actual IDs from your system');
console.log('2. Update field values to match your API requirements');
console.log('3. Add your credentials to src/test.ctx.json');
console.log('\nRun: tray-cdk connector test <operation_name> -v');


