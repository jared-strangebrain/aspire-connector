const fs = require('fs');
const path = require('path');

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating comprehensive tests with required/optional inputs documented...\n');

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

    // Generate comprehensive test
    const testContent = generateTest(op, typeName);
    fs.writeFileSync(path.join(opDir, 'handler.test.ts'), testContent);

    successCount++;
    console.log(`✅ Generated test for ${op.name}`);
  } catch (error) {
    failCount++;
    console.error(`❌ Failed to generate test for ${op.name}: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log('='.repeat(60));

// ============= Test Generation Function =============

function generateTest(op, typeName) {
  const handlerName = `${op.name}Handler`;
  
  // Analyze parameters to determine what's required
  const pathParams = op.parameters?.filter(p => p.in === 'path') || [];
  const requiredQueryParams = op.parameters?.filter(p => p.in === 'query' && p.required) || [];
  const optionalQueryParams = op.parameters?.filter(p => p.in === 'query' && !p.required) || [];
  const hasRequestBody = !!op.requestBody;
  const requestBodyRequired = op.requestBody?.required || false;
  
  // Build test input examples
  const minimalInput = buildMinimalInput(op, pathParams, requiredQueryParams, hasRequestBody, requestBodyRequired);
  const fullInput = buildFullInput(op, pathParams, requiredQueryParams, optionalQueryParams, hasRequestBody);
  
  const inputDocs = generateInputDocumentation(op, pathParams, requiredQueryParams, optionalQueryParams, hasRequestBody, requestBodyRequired);
  
  let content = `import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { ${handlerName} } from './handler';

/**
 * Test suite for ${op.name}
 * 
 * HTTP Method: ${op.method.toUpperCase()}
 * Endpoint: ${op.path}
 * 
${inputDocs}
 */
describe('${op.name}', () => {
  OperationHandlerTestSetup.configureHandlerTest(${handlerName}, (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      
      // Test Case 1: Minimal Required Inputs Only
      .testCase('should succeed with minimal required inputs', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => (${minimalInput}))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as ${typeName}Output
              expect(output.value).toBeDefined();
            }
          })
          .finallyDoNothing()
      )
`;

  // Only add full input test if there are optional parameters
  if (optionalQueryParams.length > 0) {
    content += `
      // Test Case 2: All Inputs (Required + Optional)
      .testCase('should succeed with all inputs including optional parameters', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => (${fullInput}))
          .then(({ output }) => {
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              expect(output.value).toBeDefined();
            }
          })
          .finallyDoNothing()
      )
`;
  }

  content += `
      .nothingAfterAll()
  );
});
`;

  return content;
}

function generateInputDocumentation(op, pathParams, requiredQueryParams, optionalQueryParams, hasRequestBody, requestBodyRequired) {
  const docs = [];
  
  // Document required inputs
  const requiredInputs = [];
  if (pathParams.length > 0) {
    requiredInputs.push(...pathParams.map(p => `${p.name} (path parameter)`));
  }
  if (requiredQueryParams.length > 0) {
    requiredInputs.push(...requiredQueryParams.map(p => `${p.name} (query parameter)`));
  }
  if (hasRequestBody && requestBodyRequired) {
    requiredInputs.push('body (request body)');
  }
  
  if (requiredInputs.length > 0) {
    docs.push(' * REQUIRED INPUTS:');
    requiredInputs.forEach(input => docs.push(` *   - ${input}`));
  } else {
    docs.push(' * REQUIRED INPUTS: None - all inputs are optional');
  }
  
  // Document optional inputs
  const optionalInputs = [];
  if (optionalQueryParams.length > 0) {
    optionalInputs.push(...optionalQueryParams.map(p => `${p.name} (query parameter)`));
  }
  if (hasRequestBody && !requestBodyRequired) {
    optionalInputs.push('body (request body)');
  }
  
  if (optionalInputs.length > 0) {
    docs.push(' * ');
    docs.push(' * OPTIONAL INPUTS:');
    optionalInputs.forEach(input => docs.push(` *   - ${input}`));
  }
  
  return docs.join('\n');
}

function buildMinimalInput(op, pathParams, requiredQueryParams, hasRequestBody, requestBodyRequired) {
  const inputs = {};
  
  // Add required path parameters
  for (const param of pathParams) {
    const fieldName = param.name;
    if (param.schema?.type === 'integer' || param.schema?.type === 'number') {
      inputs[fieldName] = 1;
    } else {
      inputs[fieldName] = `'test-${fieldName}'`;
    }
  }
  
  // Add required query parameters
  for (const param of requiredQueryParams) {
    const fieldName = param.name.replace(/\$/g, '').replace(/-/g, '_');
    if (param.schema?.type === 'integer' || param.schema?.type === 'number') {
      inputs[fieldName] = 10;
    } else {
      inputs[fieldName] = `'test-value'`;
    }
  }
  
  // Add required request body
  if (hasRequestBody && requestBodyRequired) {
    inputs.body = getExampleRequestBody(op);
  }
  
  return formatObject(inputs);
}

function buildFullInput(op, pathParams, requiredQueryParams, optionalQueryParams, hasRequestBody) {
  const inputs = {};
  
  // Add all path parameters
  for (const param of pathParams) {
    const fieldName = param.name;
    if (param.schema?.type === 'integer' || param.schema?.type === 'number') {
      inputs[fieldName] = 1;
    } else {
      inputs[fieldName] = `'test-${fieldName}'`;
    }
  }
  
  // Add required query parameters
  for (const param of requiredQueryParams) {
    const fieldName = param.name.replace(/\$/g, '').replace(/-/g, '_');
    if (param.schema?.type === 'integer' || param.schema?.type === 'number') {
      inputs[fieldName] = 10;
    } else {
      inputs[fieldName] = `'test-value'`;
    }
  }
  
  // Add optional query parameters (commonly used ones)
  for (const param of optionalQueryParams.slice(0, 3)) { // Include first 3 optional params as examples
    const fieldName = param.name.replace(/\$/g, '').replace(/-/g, '_');
    if (param.schema?.type === 'integer' || param.schema?.type === 'number') {
      inputs[fieldName] = 100;
    } else {
      inputs[fieldName] = `'optional-value'`;
    }
  }
  
  // Add request body if present
  if (hasRequestBody) {
    inputs.body = getExampleRequestBody(op);
  }
  
  return formatObject(inputs);
}

function getExampleRequestBody(op) {
  // Return a placeholder for request body
  // In real usage, this would be populated with actual values
  return '{ /* Request body fields */ }';
}

function formatObject(obj) {
  if (Object.keys(obj).length === 0) {
    return '{}';
  }
  
  const entries = Object.entries(obj);
  if (entries.length === 1 && entries[0][0] === 'body') {
    return `{\n            body: ${entries[0][1]}\n          }`;
  }
  
  const formatted = entries.map(([key, value]) => {
    return `            ${key}: ${value}`;
  }).join(',\n');
  
  return `{\n${formatted}\n          }`;
}

