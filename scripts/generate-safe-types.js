const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating safe TypeScript types with complex objects...\n');

let successCount = 0;
let failCount = 0;

// Helper to get schema from components
function getSchemaFromComponents(ref) {
  if (!ref || !ref.startsWith('#/components/schemas/')) return null;
  const schemaName = ref.split('/').pop();
  return swagger.components?.schemas?.[schemaName];
}

// Helper to get clean type name from ref
function getTypeName(ref) {
  if (!ref) return null;
  const parts = ref.split('/');
  const fullName = parts[parts.length - 1];
  return fullName.split('.').pop();
}

// Convert OpenAPI type to TypeScript (safe version - no nested refs)
function convertType(schema) {
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
      if (schema.items?.$ref) {
        // Nested array reference - use any to avoid issues
        return 'any[]';
      }
      return `${convertType(schema.items)}[]`;
    case 'object':
      return 'any';
    default:
      return 'any';
  }
}

// Generate a type from schema (flattened - all nested types become any)
function generateFlatType(schema) {
  if (!schema) return 'any';
  
  // Handle allOf by merging properties
  if (schema.allOf) {
    const allProps = {};
    const allRequired = new Set();
    
    for (const subSchema of schema.allOf) {
      if (subSchema.$ref) {
        const refSchema = getSchemaFromComponents(subSchema.$ref);
        if (refSchema?.properties) {
          Object.assign(allProps, refSchema.properties);
          if (refSchema.required) {
            refSchema.required.forEach(r => allRequired.add(r));
          }
        }
      } else if (subSchema.properties) {
        Object.assign(allProps, subSchema.properties);
        if (subSchema.required) {
          subSchema.required.forEach(r => allRequired.add(r));
        }
      }
    }
    
    if (Object.keys(allProps).length === 0) return 'any';
    
    const props = [];
    for (const [key, value] of Object.entries(allProps)) {
      const propType = convertType(value);
      const optional = allRequired.has(key) ? '' : '?';
      props.push(`  ${key}${optional}: ${propType};`);
    }
    
    return `{\n${props.join('\n')}\n}`;
  }
  
  // Handle properties
  if (schema.properties) {
    const props = [];
    for (const [key, value] of Object.entries(schema.properties)) {
      const propType = convertType(value);
      const optional = schema.required && schema.required.includes(key) ? '' : '?';
      props.push(`  ${key}${optional}: ${propType};`);
    }
    
    if (props.length === 0) return 'any';
    return `{\n${props.join('\n')}\n}`;
  }
  
  return convertType(schema);
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

    // Generate Input Type
    const inputContent = generateInputType(op, typeName);
    fs.writeFileSync(path.join(opDir, 'input.ts'), inputContent);

    // Generate Output Type
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
  let typeDefinitions = '';
  
  // Add request body if present
  if (op.requestBody) {
    const content = op.requestBody.content?.['application/json'];
    if (content?.schema?.$ref) {
      const schemaName = getTypeName(content.schema.$ref);
      const schemaPath = content.schema.$ref.split('/');
      const fullSchemaName = schemaPath[schemaPath.length - 1];
      const refSchema = swagger.components?.schemas?.[fullSchemaName];
      
      if (refSchema) {
        const bodyType = generateFlatType(refSchema);
        if (bodyType && bodyType !== 'any') {
          typeDefinitions += `export type ${schemaName} = ${bodyType};\n\n`;
          
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
  
  // Add path parameters
  const pathParams = op.parameters?.filter(p => p.in === 'path') || [];
  for (const param of pathParams) {
    const type = param.schema?.type === 'integer' ? 'number' : 
                 param.schema?.type === 'number' ? 'number' : 'string';
    inputFields.push({
      name: param.name,
      type,
      required: '',
      description: param.description || '',
      isPath: true
    });
  }
  
  // Add query parameters
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

  let content = typeDefinitions;
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
  let typeDefinition = '';
  
  // Get the success response
  const successResponse = op.responses?.['200'] || op.responses?.['201'] || op.responses?.['204'];
  
  if (successResponse) {
    const content = successResponse.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        // Single object reference
        const schemaName = getTypeName(schema.$ref);
        const schemaPath = schema.$ref.split('/');
        const fullSchemaName = schemaPath[schemaPath.length - 1];
        const refSchema = swagger.components?.schemas?.[fullSchemaName];
        
        if (refSchema) {
          const typeContent = generateFlatType(refSchema);
          if (typeContent && typeContent !== 'any' && schemaName) {
            typeDefinition = `export type ${schemaName} = ${typeContent};\n\n`;
            outputType = schemaName;
          }
        }
      } else if (schema.type === 'array' && schema.items?.$ref) {
        // Array of references
        const schemaName = getTypeName(schema.items.$ref);
        const schemaPath = schema.items.$ref.split('/');
        const fullSchemaName = schemaPath[schemaPath.length - 1];
        const refSchema = swagger.components?.schemas?.[fullSchemaName];
        
        if (refSchema) {
          const typeContent = generateFlatType(refSchema);
          if (typeContent && typeContent !== 'any' && schemaName) {
            typeDefinition = `export type ${schemaName} = ${typeContent};\n\n`;
            outputType = `${schemaName}[]`;
          }
        }
      } else if (schema.type === 'array') {
        // Array of primitives
        const itemType = convertType(schema.items);
        outputType = `${itemType}[]`;
      } else {
        // Primitive or simple type
        outputType = convertType(schema);
      }
    } else {
      // No content (e.g., 204 No Content)
      outputType = 'void';
    }
  }

  let content = typeDefinition;
  content += `export type ${typeName}Output = ${outputType};\n`;
  return content;
}

