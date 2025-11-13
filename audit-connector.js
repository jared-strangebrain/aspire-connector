/**
 * Audit script to compare connector operations against Swagger specification
 * This script will identify operations with incomplete or mismatched definitions
 */

const fs = require('fs');
const path = require('path');

// Load the Swagger specification
const swaggerSpec = JSON.parse(fs.readFileSync('swagger_spec.json', 'utf8'));

// Get all operation directories in src/
const srcDir = './src';
const operationDirs = fs.readdirSync(srcDir).filter(dir => {
  const fullPath = path.join(srcDir, dir);
  return fs.statSync(fullPath).isDirectory() && !dir.startsWith('.');
});

console.log(`\n🔍 Auditing ${operationDirs.length} operations against Swagger spec...\n`);

const issues = [];
const complete = [];

operationDirs.forEach(opDir => {
  try {
    // Skip auth operations as they're not in Swagger
    if (opDir.startsWith('#') || opDir.startsWith('authorization_')) {
      return;
    }

    // Read operation.json to get the operation name
    const operationJsonPath = path.join(srcDir, opDir, 'operation.json');
    if (!fs.existsSync(operationJsonPath)) {
      issues.push({ operation: opDir, issue: 'Missing operation.json' });
      return;
    }

    const operationJson = JSON.parse(fs.readFileSync(operationJsonPath, 'utf8'));
    const operationName = operationJson.name;

    // Read input and output definitions
    const inputJsonPath = path.join(srcDir, opDir, 'input.json');
    const outputJsonPath = path.join(srcDir, opDir, 'output.json');
    
    if (!fs.existsSync(inputJsonPath)) {
      issues.push({ operation: opDir, issue: 'Missing input.json' });
      return;
    }
    if (!fs.existsSync(outputJsonPath)) {
      issues.push({ operation: opDir, issue: 'Missing output.json' });
      return;
    }

    const inputJson = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
    const outputJson = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'));

    // Find matching Swagger operation
    let swaggerOp = null;
    let swaggerPath = null;
    let swaggerMethod = null;

    for (const [pathKey, pathValue] of Object.entries(swaggerSpec.paths)) {
      for (const [method, methodValue] of Object.entries(pathValue)) {
        if (methodValue.operationId) {
          // Convert operationId format (e.g., "Contacts_Create" -> "contacts_create")
          const swaggerOpId = methodValue.operationId.replace(/_/g, '_').toLowerCase();
          const ourOpId = operationName.toLowerCase();
          
          if (swaggerOpId === ourOpId) {
            swaggerOp = methodValue;
            swaggerPath = pathKey;
            swaggerMethod = method;
            break;
          }
        }
      }
      if (swaggerOp) break;
    }

    if (!swaggerOp) {
      issues.push({ 
        operation: opDir, 
        issue: 'Not found in Swagger spec',
        details: `Operation name: ${operationName}`
      });
      return;
    }

    // Check input completeness
    const inputIssues = [];
    
    // Check parameters
    if (swaggerOp.parameters) {
      const paramCount = swaggerOp.parameters.length;
      const inputProps = inputJson.properties || {};
      const inputPropCount = Object.keys(inputProps).length;
      
      if (inputPropCount < paramCount) {
        inputIssues.push(`Input has ${inputPropCount} properties but Swagger has ${paramCount} parameters`);
      }
    }

    // Check request body
    if (swaggerOp.requestBody) {
      const hasBodyProp = inputJson.properties?.body;
      if (!hasBodyProp) {
        inputIssues.push('Missing body property for request that requires requestBody');
      }
    }

    // Check output completeness
    const outputIssues = [];
    
    // Check response schema
    const response200 = swaggerOp.responses?.['200'];
    if (response200) {
      const responseSchema = response200.content?.['application/json']?.schema;
      
      if (responseSchema) {
        // Simple type check
        if (responseSchema.type === 'string' && outputJson.type !== 'string') {
          outputIssues.push(`Output should be string but is ${outputJson.type || 'object'}`);
        } else if (responseSchema.type === 'array' && outputJson.type !== 'array') {
          outputIssues.push(`Output should be array but is ${outputJson.type || 'object'}`);
        } else if (responseSchema.$ref) {
          // Complex object - check if we have properties defined
          if (!outputJson.properties && !outputJson.$ref) {
            outputIssues.push('Output should be object with properties but has none defined');
          }
        }
      }
    }

    if (inputIssues.length > 0 || outputIssues.length > 0) {
      issues.push({
        operation: opDir,
        swagger: `${swaggerMethod.toUpperCase()} ${swaggerPath}`,
        inputIssues,
        outputIssues
      });
    } else {
      complete.push(opDir);
    }

  } catch (error) {
    issues.push({ 
      operation: opDir, 
      issue: 'Error reading operation files',
      error: error.message
    });
  }
});

// Print results
console.log(`\n✅ COMPLETE OPERATIONS: ${complete.length}\n`);

console.log(`\n⚠️  OPERATIONS WITH ISSUES: ${issues.length}\n`);
console.log('═'.repeat(80));

issues.forEach(issue => {
  console.log(`\n📋 Operation: ${issue.operation}`);
  if (issue.swagger) {
    console.log(`   Swagger: ${issue.swagger}`);
  }
  if (issue.issue) {
    console.log(`   ❌ ${issue.issue}`);
  }
  if (issue.details) {
    console.log(`   Details: ${issue.details}`);
  }
  if (issue.error) {
    console.log(`   Error: ${issue.error}`);
  }
  if (issue.inputIssues && issue.inputIssues.length > 0) {
    console.log(`   Input Issues:`);
    issue.inputIssues.forEach(i => console.log(`      - ${i}`));
  }
  if (issue.outputIssues && issue.outputIssues.length > 0) {
    console.log(`   Output Issues:`);
    issue.outputIssues.forEach(i => console.log(`      - ${i}`));
  }
});

console.log('\n' + '═'.repeat(80));
console.log(`\n📊 Summary:`);
console.log(`   ✅ Complete: ${complete.length}`);
console.log(`   ⚠️  Needs review: ${issues.length}`);
console.log(`   📁 Total operations: ${operationDirs.length}`);
console.log('');

// Save detailed report to file
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: operationDirs.length,
    complete: complete.length,
    needsReview: issues.length
  },
  completeOperations: complete,
  operationsWithIssues: issues
};

fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
console.log('📄 Detailed report saved to: audit-report.json\n');


