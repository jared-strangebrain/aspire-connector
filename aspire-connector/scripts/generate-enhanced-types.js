const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating enhanced types with complete nested objects...\n');

let successCount = 0;
let failCount = 0;

// Track all generated types to avoid duplicates
const generatedTypes = new Set();

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
        return `${convertPropertyType(schema.items)}[]`;
      }
      return 'any[]';
    case 'object':
      return 'any';
    default:
      return 'any';
  }
}

// Convert property type and track nested references
function convertPropertyType(schema, collectedTypes = []) {
  if (!schema) return 'any';
  
  // Handle $ref - this is a complex type we need to generate
  if (schema.$ref) {
    const typeName = getTypeName(schema.$ref);
    if (typeName && !generatedTypes.has(typeName)) {
      collectedTypes.push(schema.$ref);
    }
    return typeName || 'any';
  }
  
  // Handle array
  if (schema.type === 'array') {
    if (schema.items?.$ref) {
      const typeName = getTypeName(schema.items.$ref);
      if (typeName && !generatedTypes.has(typeName)) {
        collectedTypes.push(schema.items.$ref);
      }
      return `${typeName}[]`;
    }
    return `${convertSimpleType(schema.items)}[]`;
  }
  
  return convertSimpleType(schema);
}

// Generate a complete type with all its nested dependencies
function generateCompleteType(schemaRef, depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return '';
  
  const typeName = getTypeName(schemaRef);
  if (!typeName || generatedTypes.has(typeName)) return '';
  
  const schema = getSchemaFromComponents(schemaRef);
  if (!schema) return '';
  
  generatedTypes.add(typeName);
  
  let output = '';
  const nestedRefs = [];
  
  // Handle allOf (inheritance)
  if (schema.allOf) {
    // For allOf, we'll flatten it into a single type
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
    
    const props = [];
    for (const [key, value] of Object.entries(allProps)) {
      const propType = convertPropertyType(value, nestedRefs);
      const optional = allRequired.has(key) ? '' : '?';
      props.push(`  ${key}${optional}: ${propType};`);
    }
    
    if (props.length > 0) {
      output = `export type ${typeName} = {\n${props.join('\n')}\n};\n\n`;
    }
  }
  // Handle properties
  else if (schema.properties) {
    const props = [];
    for (const [key, value] of Object.entries(schema.properties)) {
      const propType = convertPropertyType(value, nestedRefs);
      const optional = schema.required && schema.required.includes(key) ? '' : '?';
      props.push(`  ${key}${optional}: ${propType};`);
    }
    
    if (props.length > 0) {
      output = `export type ${typeName} = {\n${props.join('\n')}\n};\n\n`;
    }
  }
  // Handle simple types
  else {
    const simpleType = convertSimpleType(schema);
    output = `export type ${typeName} = ${simpleType};\n\n`;
  }
  
  // Recursively generate nested types
  let nestedOutput = '';
  for (const nestedRef of nestedRefs) {
    nestedOutput += generateCompleteType(nestedRef, depth + 1, maxDepth);
  }
  
  return nestedOutput + output;
}

// Process each operation
for (const op of operations) {
  try {
    generatedTypes.clear();
    
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

    // Generate Output Type with nested types
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
  generatedTypes.clear();
  
  const inputFields = [];
  let typeDefinitions = '';
  
  // Add request body if present
  if (op.requestBody) {
    const content = op.requestBody.content?.['application/json'];
    if (content?.schema?.$ref) {
      const bodyTypeDef = generateCompleteType(content.schema.$ref);
      typeDefinitions += bodyTypeDef;
      
      const bodyTypeName = getTypeName(content.schema.$ref);
      inputFields.push({
        name: 'body',
        type: bodyTypeName,
        required: op.requestBody.required ? '' : '?',
        description: 'Request body'
      });
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
      required: '',
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
  generatedTypes.clear();
  
  let outputType = 'any';
  let typeDefinitions = '';
  
  // Get the success response
  const successResponse = op.responses?.['200'] || op.responses?.['201'] || op.responses?.['204'];
  
  if (successResponse) {
    const content = successResponse.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        // Single object reference - generate all nested types
        typeDefinitions = generateCompleteType(schema.$ref);
        outputType = getTypeName(schema.$ref);
      } else if (schema.type === 'array' && schema.items?.$ref) {
        // Array of references - generate all nested types
        typeDefinitions = generateCompleteType(schema.items.$ref);
        outputType = `${getTypeName(schema.items.$ref)}[]`;
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

  let content = typeDefinitions;
  content += `export type ${typeName}Output = ${outputType};\n`;
  return content;
}

