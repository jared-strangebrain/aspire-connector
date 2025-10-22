const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating complete TypeScript types with proper outputs...\n');

let successCount = 0;
let failCount = 0;

// Helper to convert OpenAPI type to TypeScript
function convertSimpleType(schema) {
  if (!schema) return 'any';
  
  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      if (schema.items) {
        return `${convertSimpleType(schema.items)}[]`;
      }
      return 'any[]';
    case 'object':
      return 'any';
    default:
      return 'any';
  }
}

// Get schema name from reference
function getSchemaName(ref) {
  if (!ref) return null;
  const parts = ref.split('/');
  return parts[parts.length - 1].split('.').pop();
}

// Process each operation
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

    // Generate Input Type (keep existing logic)
    const inputContent = generateInputType(op, typeName);
    fs.writeFileSync(path.join(opDir, 'input.ts'), inputContent);

    // Generate Output Type (improved)
    const outputContent = generateOutputType(op, typeName);
    fs.writeFileSync(path.join(opDir, 'output.ts'), outputContent);

    successCount++;
    console.log(`✅ Generated types for ${op.name}`);
  } catch (error) {
    failCount++;
    console.error(`❌ Failed to generate types for ${op.name}: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  ✅ Success: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log('='.repeat(60));

// ============= Helper Functions =============

function generateInputType(op, typeName) {
  const inputFields = [];
  const interfaces = [];
  
  // Add request body if present
  if (op.requestBody) {
    const content = op.requestBody.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        const schemaName = getSchemaName(schema.$ref);
        const schemaPath = schema.$ref.split('/');
        const fullSchemaName = schemaPath[schemaPath.length - 1];
        const refSchema = swagger.components?.schemas?.[fullSchemaName];
        
        if (refSchema) {
          // Generate inline type for request body
          const bodyType = generateInlineType(refSchema);
          interfaces.push(`export type ${schemaName} = ${bodyType};`);
          
          inputFields.push({
            name: 'body',
            type: schemaName,
            required: op.requestBody.required ? '' : '?',
            description: 'Request body'
          });
        }
      }
    }
  }
  
  // Add path parameters (always required)
  const pathParams = op.parameters?.filter(p => p.in === 'path') || [];
  for (const param of pathParams) {
    const type = param.schema?.type === 'integer' ? 'number' : 
                 param.schema?.type === 'number' ? 'number' : 'string';
    inputFields.push({
      name: param.name,
      type,
      required: '', // Path params are always required
      description: param.description || '',
      isPath: true
    });
  }
  
  // Add query parameters (usually optional)
  const queryParams = op.parameters?.filter(p => p.in === 'query') || [];
  for (const param of queryParams) {
    const fieldName = param.name.replace(/\$/g, '').replace(/-/g, '_');
    const required = param.required ? '' : '?';
    const type = param.schema?.type === 'integer' ? 'number' :
                 param.schema?.type === 'number' ? 'number' : 'string';
    
    inputFields.push({
      name: fieldName,
      type,
      required,
      description: param.description || '',
      original: param.name
    });
  }

  let content = interfaces.length > 0 ? interfaces.join('\n\n') + '\n\n' : '';
  content += `export type ${typeName}Input = {\n`;
  
  if (inputFields.length === 0) {
    content += '  // No input parameters required\n';
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

function generateOutputType(op, typeName) {
  let outputType = 'any';
  let interfaces = [];
  
  // Get the success response
  const successResponse = op.responses?.['200'] || op.responses?.['201'] || op.responses?.['204'];
  
  if (successResponse) {
    const content = successResponse.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        // Single object reference
        const schemaName = getSchemaName(schema.$ref);
        const schemaPath = schema.$ref.split('/');
        const fullSchemaName = schemaPath[schemaPath.length - 1];
        const refSchema = swagger.components?.schemas?.[fullSchemaName];
        
        if (refSchema) {
          const typeContent = generateInlineType(refSchema);
          interfaces.push(`export type ${schemaName} = ${typeContent};`);
          outputType = schemaName;
        }
      } else if (schema.type === 'array' && schema.items?.$ref) {
        // Array of references
        const schemaName = getSchemaName(schema.items.$ref);
        const schemaPath = schema.items.$ref.split('/');
        const fullSchemaName = schemaPath[schemaPath.length - 1];
        const refSchema = swagger.components?.schemas?.[fullSchemaName];
        
        if (refSchema) {
          const typeContent = generateInlineType(refSchema);
          interfaces.push(`export type ${schemaName} = ${typeContent};`);
          outputType = `${schemaName}[]`;
        }
      } else if (schema.type === 'array') {
        // Array of primitives
        const itemType = convertSimpleType(schema.items);
        outputType = `${itemType}[]`;
      } else {
        // Inline schema or primitive
        outputType = convertSimpleType(schema);
      }
    } else {
      // No content (e.g., 204 No Content)
      outputType = 'void';
    }
  }

  let content = interfaces.length > 0 ? interfaces.join('\n\n') + '\n\n' : '';
  content += `export type ${typeName}Output = ${outputType};\n`;
  return content;
}

function generateInlineType(schema, depth = 0) {
  if (!schema || depth > 2) return 'any';
  
  // Handle allOf
  if (schema.allOf) {
    return 'any'; // Simplify inheritance
  }
  
  // Handle properties
  if (schema.properties) {
    const props = [];
    for (const [key, value] of Object.entries(schema.properties)) {
      const propType = convertPropertyType(value);
      const optional = schema.required && schema.required.includes(key) ? '' : '?';
      props.push(`  ${key}${optional}: ${propType};`);
    }
    
    if (props.length === 0) return 'any';
    return `{\n${props.join('\n')}\n}`;
  }
  
  return convertSimpleType(schema);
}

function convertPropertyType(schema) {
  if (!schema) return 'any';
  
  // Handle $ref in properties
  if (schema.$ref) {
    const schemaName = getSchemaName(schema.$ref);
    return schemaName || 'any';
  }
  
  // Handle array
  if (schema.type === 'array') {
    if (schema.items?.$ref) {
      const itemName = getSchemaName(schema.items.$ref);
      return `${itemName}[]`;
    }
    return `${convertSimpleType(schema.items)}[]`;
  }
  
  return convertSimpleType(schema);
}

