const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating documented types with full interfaces...\n');

let successCount = 0;
let failCount = 0;
let detailedCount = 0;

// Helper functions
function getSchemaFromComponents(ref) {
  if (!ref || !ref.startsWith('#/components/schemas/')) return null;
  const schemaName = ref.split('/').pop();
  return swagger.components?.schemas?.[schemaName];
}

function getTypeName(ref) {
  if (!ref) return null;
  const parts = ref.split('/');
  return parts[parts.length - 1].split('.').pop();
}

function convertPropertyType(schema) {
  if (!schema) return 'any';
  if (schema.$ref) return 'any';
  if (schema.type === 'array') {
    if (schema.items?.$ref) return 'any[]';
    return `${convertPropertyType(schema.items)}[]`;
  }
  if (schema.enum && Array.isArray(schema.enum)) {
    return schema.enum.map(v => `'${v}'`).join(' | ');
  }
  switch (schema.type) {
    case 'string': return 'string';
    case 'number':
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'object': return 'any';
    default: return 'any';
  }
}

function generateInterface(schema, typeName) {
  if (!schema) return null;
  
  const fields = [];
  let allProperties = {};
  let allRequired = new Set();
  
  // Handle allOf
  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      if (subSchema.$ref) {
        const refSchema = getSchemaFromComponents(subSchema.$ref);
        if (refSchema?.properties) {
          Object.assign(allProperties, refSchema.properties);
          if (refSchema.required) {
            refSchema.required.forEach(r => allRequired.add(r));
          }
        }
      } else if (subSchema.properties) {
        Object.assign(allProperties, subSchema.properties);
        if (subSchema.required) {
          subSchema.required.forEach(r => allRequired.add(r));
        }
      }
    }
  } else if (schema.properties) {
    allProperties = schema.properties;
    if (schema.required) {
      schema.required.forEach(r => allRequired.add(r));
    }
  } else {
    return null;
  }
  
  // Generate fields
  for (const [key, value] of Object.entries(allProperties)) {
    const optional = allRequired.has(key) ? '' : '?';
    const propType = convertPropertyType(value);
    
    let fieldDef = '';
    if (value.description) {
      fieldDef += `  /** ${value.description} */\n`;
    }
    fieldDef += `  ${key}${optional}: ${propType};`;
    fields.push(fieldDef);
  }
  
  if (fields.length === 0) return null;
  
  return `export interface ${typeName} {\n${fields.join('\n')}\n}`;
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

    // Generate Output Type
    const outputContent = generateOutputType(op, typeName);
    fs.writeFileSync(path.join(opDir, 'output.ts'), outputContent);

    successCount++;
    const isDetailed = outputContent.includes('export interface');
    if (isDetailed) {
      detailedCount++;
      console.log(`✅ ${op.name} (detailed interface)`);
    } else {
      console.log(`✅ ${op.name} (simple type)`);
    }
  } catch (error) {
    failCount++;
    console.error(`❌ Failed: ${op.name}: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  ✅ Total Success: ${successCount}`);
console.log(`  📋 Detailed Interfaces: ${detailedCount}`);
console.log(`  📝 Simple Types: ${successCount - detailedCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log('='.repeat(60));

function generateOutputType(op, typeName) {
  let outputType = 'any';
  let typeInterface = '';
  
  // Get the success response
  const successResponse = op.responses?.['200'] || op.responses?.['201'] || op.responses?.['204'];
  
  if (!successResponse) {
    return `export type ${typeName}Output = any;\n`;
  }
  
  const content = successResponse.content?.['application/json'];
  
  // Handle no content responses
  if (!content) {
    return `export type ${typeName}Output = void;\n`;
  }
  
  const schema = content.schema;
  if (!schema) {
    return `export type ${typeName}Output = any;\n`;
  }
  
  // Single object reference
  if (schema.$ref) {
    const schemaName = getTypeName(schema.$ref);
    const refSchema = getSchemaFromComponents(schema.$ref);
    
    if (refSchema && schemaName) {
      const interfaceDef = generateInterface(refSchema, schemaName);
      if (interfaceDef) {
        typeInterface = interfaceDef + '\n\n';
        outputType = schemaName;
      }
    }
  }
  // Array of objects
  else if (schema.type === 'array' && schema.items?.$ref) {
    const schemaName = getTypeName(schema.items.$ref);
    const refSchema = getSchemaFromComponents(schema.items.$ref);
    
    if (refSchema && schemaName) {
      const interfaceDef = generateInterface(refSchema, schemaName);
      if (interfaceDef) {
        typeInterface = interfaceDef + '\n\n';
        outputType = `${schemaName}[]`;
      }
    }
  }
  // Array of primitives
  else if (schema.type === 'array') {
    const itemType = convertPropertyType(schema.items);
    outputType = `${itemType}[]`;
  }
  // Primitive types
  else {
    outputType = convertPropertyType(schema);
  }

  return `${typeInterface}export type ${typeName}Output = ${outputType};\n`;
}

