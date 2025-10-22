const fs = require('fs');
const path = require('path');

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log(`Configuring ${operations.length} operation handlers...\n`);

let successCount = 0;
let failCount = 0;

for (const op of operations) {
  try {
    const opDir = path.join(__dirname, '..', 'src', op.name);
    
    if (!fs.existsSync(opDir)) {
      console.log(`⏭️  Skipping ${op.name} (directory not found)`);
      continue;
    }

    // Generate Input Type
    const inputPath = path.join(opDir, 'input.ts');
    const inputContent = generateInputType(op);
    fs.writeFileSync(inputPath, inputContent);

    // Generate Output Type  
    const outputPath = path.join(opDir, 'output.ts');
    const outputContent = generateOutputType(op);
    fs.writeFileSync(outputPath, outputContent);

    // Generate Handler
    const handlerPath = path.join(opDir, 'handler.ts');
    const handlerContent = generateHandler(op);
    fs.writeFileSync(handlerPath, handlerContent);

    // Create operation.json
    const operationJsonPath = path.join(opDir, 'operation.json');
    const operationJson = {
      name: op.name,
      title: formatTitle(op.name),
      description: `${op.method} ${op.path}`,
    };
    fs.writeFileSync(operationJsonPath, JSON.stringify(operationJson, null, 2));

    successCount++;
    console.log(`✅ Configured ${op.name}`);
  } catch (error) {
    failCount++;
    console.error(`❌ Failed to configure ${op.name}: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log('='.repeat(60));

// Helper functions
function formatTitle(name) {
  return name
    .split('_')
    .filter(w => w !== '_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function generateInputType(op) {
  const inputFields = [];
  
  // Add query parameters
  if (op.parameters && op.parameters.length > 0) {
    for (const param of op.parameters) {
      if (param.in === 'query') {
        const fieldName = param.name.replace(/\$/g, '').replace(/-/g, '_');
        const required = param.required ? '' : '?';
        const type = param.schema?.type === 'number' ? 'number' : 'string';
        
        inputFields.push({
          name: fieldName,
          type,
          required,
          description: param.description || '',
          original: param.name
        });
      } else if (param.in === 'path') {
        const fieldName = param.name;
        const required = ''; // Path params are always required
        const type = param.schema?.type === 'number' ? 'number' : 'string';
        
        inputFields.push({
          name: fieldName,
          type,
          required,
          description: param.description || '',
          original: param.name,
          isPath: true
        });
      }
    }
  }

  // Add request body if present
  if (op.requestBody) {
    inputFields.push({
      name: 'body',
      type: 'any',
      required: op.requestBody.required ? '' : '?',
      description: 'Request body'
    });
  }

  const typeName = op.name.split('_').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join('') + 'Input';

  let content = `export type ${typeName} = {\n`;
  
  if (inputFields.length === 0) {
    content += '  // No input parameters\n';
  } else {
    for (const field of inputFields) {
      if (field.description) {
        content += `  /**\n   * ${field.description}\n   */\n`;
      }
      if (field.original && field.original !== field.name) {
        content += `  // Original parameter name: ${field.original}\n`;
      }
      content += `  ${field.name}${field.required}: ${field.type};\n`;
    }
  }
  
  content += '};\n';
  return content;
}

function generateOutputType(op) {
  const typeName = op.name.split('_').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join('') + 'Output';

  // For now, use a generic output type
  // TODO: Could be enhanced to parse response schemas
  return `export type ${typeName} = any;\n`;
}

function generateHandler(op) {
  const typeName = op.name.split('_').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join('');
  
  const inputType = `${typeName}Input`;
  const outputType = `${typeName}Output`;

  // Build the URL path
  let urlPath = op.path;
  const pathParams = op.parameters?.filter(p => p.in === 'path') || [];
  
  let content = `import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { ${inputType} } from './input';
import { ${outputType} } from './output';

export const ${op.name}Handler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ${inputType},
  ${outputType}
>((handler) =>
  handler.usingHttp((http) =>
    http.${op.method.toLowerCase()}('${urlPath}')
      .handleRequest((ctx, input, request) => {
`;

  // Add path parameters
  if (pathParams.length > 0) {
    content += `        let req = request;\n`;
    for (const param of pathParams) {
      content += `        req = req.addPathParameter('${param.name}', String(input.${param.name}));\n`;
    }
  } else {
    content += `        let req = request;\n`;
  }

  // Add query parameters
  const queryParams = op.parameters?.filter(p => p.in === 'query') || [];
  if (queryParams.length > 0) {
    for (const param of queryParams) {
      const fieldName = param.name.replace(/\$/g, '').replace(/-/g, '_');
      const required = param.required;
      
      if (required) {
        content += `        req = req.addQueryString('${param.name}', String(input.${fieldName}));\n`;
      } else {
        content += `        if (input.${fieldName} !== undefined) {\n`;
        content += `          req = req.addQueryString('${param.name}', String(input.${fieldName}));\n`;
        content += `        }\n`;
      }
    }
  }

  // Handle request body
  if (op.requestBody) {
    content += `        return req.withBodyAsJson(input.body);\n`;
  } else {
    content += `        return req.withoutBody();\n`;
  }

  content += `      })
      .handleResponse((ctx, input, response) => 
        response.parseWithBodyAsJson()
      )
  )
);
`;

  return content;
}

