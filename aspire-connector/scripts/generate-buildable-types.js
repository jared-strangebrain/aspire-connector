const fs = require('fs');
const path = require('path');

// Read the swagger.json file
const swaggerPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// Read operations list
const operationsPath = path.join(__dirname, 'operations-list.json');
const operations = JSON.parse(fs.readFileSync(operationsPath, 'utf8'));

console.log('Generating buildable output types with documentation...\n');

let successCount = 0;
let failCount = 0;

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

function getSchemaFieldsDocumentation(schema, depth = 0) {
  if (!schema || depth > 2) return '';
  
  const fields = [];
  
  // Handle allOf
  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      if (subSchema.$ref) {
        const refSchema = getSchemaFromComponents(subSchema.$ref);
        if (refSchema?.properties) {
          fields.push(...Object.keys(refSchema.properties));
        }
      } else if (subSchema.properties) {
        fields.push(...Object.keys(subSchema.properties));
      }
    }
  }
  // Handle properties
  else if (schema.properties) {
    fields.push(...Object.keys(schema.properties));
  }
  
  return fields;
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

    // Generate Output Type with documentation
    const outputContent = generateOutputType(op, typeName);
    fs.writeFileSync(path.join(opDir, 'output.ts'), outputContent);

    successCount++;
    console.log(`✅ Generated output type for ${op.name}`);
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

function generateOutputType(op, typeName) {
  let outputType = 'any';
  let documentation = '';
  
  // Get the success response
  const successResponse = op.responses?.['200'] || op.responses?.['201'] || op.responses?.['204'];
  
  if (successResponse) {
    const content = successResponse.content?.['application/json'];
    if (content?.schema) {
      const schema = content.schema;
      
      if (schema.$ref) {
        const schemaName = getTypeName(schema.$ref);
        const refSchema = getSchemaFromComponents(schema.$ref);
        const fields = getSchemaFieldsDocumentation(refSchema);
        
        if (fields.length > 0) {
          documentation = `/**\n * ${schemaName} object with ${fields.length} fields:\n`;
          documentation += ` * ${fields.slice(0, 10).join(', ')}`;
          if (fields.length > 10) {
            documentation += `, ... and ${fields.length - 10} more`;
          }
          documentation += `\n */\n`;
        }
        outputType = 'any';
      } else if (schema.type === 'array' && schema.items?.$ref) {
        const schemaName = getTypeName(schema.items.$ref);
        const refSchema = getSchemaFromComponents(schema.items.$ref);
        const fields = getSchemaFieldsDocumentation(refSchema);
        
        if (fields.length > 0) {
          documentation = `/**\n * Array of ${schemaName} objects, each with ${fields.length} fields:\n`;
          documentation += ` * ${fields.slice(0, 10).join(', ')}`;
          if (fields.length > 10) {
            documentation += `, ... and ${fields.length - 10} more`;
          }
          documentation += `\n */\n`;
        }
        outputType = 'any[]';
      } else if (schema.type === 'array') {
        outputType = convertSimpleType(schema.items) + '[]';
      } else {
        outputType = convertSimpleType(schema);
      }
    } else {
      outputType = 'void';
    }
  }

  return `${documentation}export type ${typeName}Output = ${outputType};\n`;
}

function convertSimpleType(schema) {
  if (!schema) return 'any';
  switch (schema.type) {
    case 'string': return 'string';
    case 'number':
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    default: return 'any';
  }
}

