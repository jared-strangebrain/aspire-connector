const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating enhanced TypeScript types from OpenAPI schemas...\n');

let successCount = 0;
let failCount = 0;

// Track which types have been collected
const collectedTypes = new Set();

// Helper function to convert schema reference to type name
function getTypeNameFromRef(ref) {
  if (!ref) return 'any';
  const parts = ref.split('/');
  const schemaName = parts[parts.length - 1];
  return schemaName.split('.').pop();
}

// Helper function to convert OpenAPI type to TypeScript type
function convertType(schema, depth = 0, interfaces = []) {
  if (!schema) return 'any';
  
  // Prevent infinite recursion
  if (depth > 5) return 'any';
  
  // Handle $ref
  if (schema.$ref) {
    const typeName = getTypeNameFromRef(schema.$ref);
    
    // Collect this type if we haven't already
    if (!collectedTypes.has(typeName) && interfaces) {
      collectedTypes.add(typeName);
      const refSchema = getSchemaFromComponents(schema.$ref);
      if (refSchema) {
        const interfaceContent = generateInterface(typeName, refSchema, depth + 1, interfaces);
        interfaces.push(`export type ${typeName} = ${interfaceContent};`);
      }
    }
    
    return typeName;
  }
  
  // Handle array
  if (schema.type === 'array') {
    if (schema.items) {
      const itemType = convertType(schema.items, depth + 1, interfaces);
      return `${itemType}[]`;
    }
    return 'any[]';
  }
  
  // Handle object with properties
  if (schema.type === 'object' && schema.properties) {
    const props = [];
    for (const [key, value] of Object.entries(schema.properties)) {
      const propType = convertType(value, depth + 1, interfaces);
      const optional = schema.required && schema.required.includes(key) ? '' : '?';
      props.push(`  ${key}${optional}: ${propType};`);
    }
    return `{\n${props.join('\n')}\n}`;
  }
  
  // Handle basic types
  switch (schema.type) {
    case 'string':
      return schema.enum ? schema.enum.map(e => `'${e}'`).join(' | ') : 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'any';
    default:
      return 'any';
  }
}

// Helper function to get schema from components
function getSchemaFromComponents(ref) {
  if (!ref || !ref.startsWith('#/components/schemas/')) return null;
  const schemaName = ref.split('/').pop();
  return swagger.components?.schemas?.[schemaName];
}

// Helper function to generate TypeScript interface from schema
function generateInterface(schemaName, schema, depth = 0, interfaces = []) {
  if (!schema || depth > 3) return 'any';
  
  // If it's a simple type, return it directly
  if (schema.type !== 'object' && !schema.properties && !schema.allOf) {
    const result = convertType(schema, 0, interfaces);
    return result || 'any';
  }
  
  // Handle allOf (inheritance)
  if (schema.allOf) {
    const types = schema.allOf.map(s => {
      if (s.$ref) {
        const typeName = getTypeNameFromRef(s.$ref);
        // Collect this type
        if (!collectedTypes.has(typeName)) {
          collectedTypes.add(typeName);
          const refSchema = getSchemaFromComponents(s.$ref);
          if (refSchema) {
            const interfaceContent = generateInterface(typeName, refSchema, depth + 1, interfaces);
            if (interfaceContent) {
              interfaces.push(`export type ${typeName} = ${interfaceContent};`);
            }
          }
        }
        return typeName;
      }
      return convertType(s, depth + 1, interfaces);
    });
    const filtered = types.filter(t => t && t !== 'any');
    if (filtered.length === 0) return 'any';
    return filtered.join(' & ');
  }
  
  // Build interface
  const props = [];
  if (schema.properties) {
    for (const [key, value] of Object.entries(schema.properties)) {
      const propType = convertType(value, depth + 1, interfaces);
      const optional = schema.required && schema.required.includes(key) ? '' : '?';
      const description = value.description ? `  /** ${value.description} */\n` : '';
      props.push(`${description}  ${key}${optional}: ${propType};`);
    }
  }
  
  if (props.length === 0) {
    return 'any';
  }
  
  return `{\n${props.join('\n')}\n}`;
}

// Process each operation
for (const op of operations) {
  try {
    // Reset collected types for each operation
    collectedTypes.clear();
    
    const opDir = path.join(__dirname, '..', 'src', op.name);
    
    if (!fs.existsSync(opDir)) {
      console.log(`⏭️  Skipping ${op.name} (directory not found)`);
      continue;
    }

    const typeName = op.name.split('_').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join('');

    // Generate Enhanced Input Type
    let inputContent = generateInputType(op, typeName);
    fs.writeFileSync(path.join(opDir, 'input.ts'), inputContent);

    // Generate Enhanced Output Type
    let outputContent = generateOutputType(op, typeName);
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

// Input Type Generator
function generateInputType(op, typeName) {
  const inputFields = [];
  const interfaces = [];
  
  // Add request body schema if present
  if (op.requestBody) {
    const content = op.requestBody.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        const refSchema = getSchemaFromComponents(schema.$ref);
        const schemaTypeName = getTypeNameFromRef(schema.$ref);
        
        if (refSchema) {
          collectedTypes.add(schemaTypeName);
          const interfaceContent = generateInterface(schemaTypeName, refSchema, 0, interfaces);
          interfaces.push(`export type ${schemaTypeName} = ${interfaceContent};`);
          
          // For request body, we might want to embed it or reference it
          inputFields.push({
            name: 'body',
            type: schemaTypeName,
            required: op.requestBody.required ? '' : '?',
            description: 'Request body'
          });
        }
      } else {
        // Inline schema
        const bodyType = convertType(schema, 0, interfaces);
        inputFields.push({
          name: 'body',
          type: bodyType,
          required: op.requestBody.required ? '' : '?',
          description: 'Request body'
        });
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

  let content = interfaces.length > 0 ? interfaces.join('\n\n') + '\n\n' : '';
  content += `export type ${typeName}Input = {\n`;
  
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

// Output Type Generator
function generateOutputType(op, typeName) {
  const interfaces = [];
  let outputType = 'any';
  
  // Get the 200/201 response
  const successResponse = op.responses?.['200'] || op.responses?.['201'] || op.responses?.['204'];
  
  if (successResponse) {
    const content = successResponse.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        // Reference to a schema
        const refSchema = getSchemaFromComponents(schema.$ref);
        const schemaTypeName = getTypeNameFromRef(schema.$ref);
        
        if (refSchema) {
          collectedTypes.add(schemaTypeName);
          const interfaceContent = generateInterface(schemaTypeName, refSchema, 0, interfaces);
          interfaces.push(`export type ${schemaTypeName} = ${interfaceContent};`);
          outputType = schemaTypeName;
        }
      } else if (schema.type === 'array' && schema.items?.$ref) {
        // Array of references
        const refSchema = getSchemaFromComponents(schema.items.$ref);
        const schemaTypeName = getTypeNameFromRef(schema.items.$ref);
        
        if (refSchema) {
          collectedTypes.add(schemaTypeName);
          const interfaceContent = generateInterface(schemaTypeName, refSchema, 0, interfaces);
          interfaces.push(`export type ${schemaTypeName} = ${interfaceContent};`);
          outputType = `${schemaTypeName}[]`;
        }
      } else {
        // Inline schema
        outputType = convertType(schema, 0, interfaces);
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

