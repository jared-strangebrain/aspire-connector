const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Function to convert operationId to snake_case
function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/__+/g, '_'); // Replace double underscores with single
}

// Function to get HTTP method from operation
function getHttpMethod(pathItem) {
  const methods = ['get', 'post', 'put', 'patch', 'delete'];
  for (const method of methods) {
    if (pathItem[method]) {
      return { method, operation: pathItem[method] };
    }
  }
  return null;
}

// Extract all operations
const operations = [];
for (const [path, pathItem] of Object.entries(swagger.paths)) {
  const methodInfo = getHttpMethod(pathItem);
  if (methodInfo) {
    const { method, operation } = methodInfo;
    const operationId = operation.operationId;
    const operationName = toSnakeCase(operationId);
    
    operations.push({
      name: operationName,
      operationId,
      path,
      method: method.toUpperCase(),
      parameters: operation.parameters || [],
      requestBody: operation.requestBody,
      responses: operation.responses,
      tags: operation.tags || []
    });
  }
}

console.log(`Found ${operations.length} operations`);
console.log('\nOperations to create:');
operations.forEach(op => {
  console.log(`  - ${op.name} (${op.method} ${op.path})`);
});

// Save operations list
fs.writeFileSync(
  path.join(__dirname, 'operations-list.json'),
  JSON.stringify(operations, null, 2)
);

console.log(`\nOperations list saved to scripts/operations-list.json`);

