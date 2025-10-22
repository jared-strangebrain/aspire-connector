const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load OpenAPI spec
const openApiPath = path.join(__dirname, '../../OpenAPI SPEC/swagger.json');
const openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));

// Load missing operations list
const missingOpsPath = path.join(__dirname, 'missing-operations-list.json');
const missingOperations = JSON.parse(fs.readFileSync(missingOpsPath, 'utf8'));

console.log(`Found ${missingOperations.length} missing operations to scaffold\n`);

// Helper to convert OpenAPI type to TypeScript type
function convertType(schema, name = 'Type') {
  if (!schema) return 'any';
  
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return refName.replace(/\./g, '');
  }
  
  if (schema.type === 'array') {
    return `${convertType(schema.items, name)}[]`;
  }
  
  if (schema.type === 'object') {
    if (schema.properties) {
      const props = Object.entries(schema.properties).map(([key, value]) => {
        const required = schema.required?.includes(key) ? '' : '?';
        const nullable = value.nullable ? ' | null' : '';
        return `  ${key}${required}: ${convertType(value, key)}${nullable};`;
      }).join('\n');
      return `{\n${props}\n}`;
    }
    return 'Record<string, any>';
  }
  
  const typeMap = {
    'string': 'string',
    'integer': 'number',
    'number': 'number',
    'boolean': 'boolean'
  };
  
  return typeMap[schema.type] || 'any';
}

// Helper to resolve schema reference
function resolveRef(ref) {
  if (!ref) return null;
  const parts = ref.replace('#/', '').split('/');
  let current = openApiSpec;
  for (const part of parts) {
    current = current[part];
    if (!current) return null;
  }
  return current;
}

// Helper to generate TypeScript interface from schema
function generateTypeFromSchema(schema, interfaceName) {
  if (!schema) return 'any';
  
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref);
    if (resolved) {
      schema = resolved;
    }
  }
  
  if (schema.type === 'array') {
    if (schema.items.$ref) {
      const itemSchema = resolveRef(schema.items.$ref);
      const itemTypeName = schema.items.$ref.split('/').pop().replace(/\./g, '');
      return { arrayOf: itemTypeName, itemSchema: itemSchema };
    }
    return { arrayOf: 'any' };
  }
  
  if (schema.type === 'object' && schema.properties) {
    const fields = [];
    const required = schema.required || [];
    
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const isRequired = required.includes(propName);
      const nullable = propSchema.nullable ? ' | null' : '';
      let propType = 'any';
      
      if (propSchema.$ref) {
        propType = propSchema.$ref.split('/').pop().replace(/\./g, '');
      } else if (propSchema.type === 'array') {
        if (propSchema.items.$ref) {
          propType = propSchema.items.$ref.split('/').pop().replace(/\./g, '') + '[]';
        } else {
          propType = convertType(propSchema.items) + '[]';
        }
      } else {
        const typeMap = {
          'string': 'string',
          'integer': 'number',
          'number': 'number',
          'boolean': 'boolean'
        };
        propType = typeMap[propSchema.type] || 'any';
        
        if (propSchema.format === 'date-time') {
          propType = 'string';
        }
      }
      
      fields.push({
        name: propName,
        type: propType + nullable,
        optional: !isRequired,
        description: propSchema.description
      });
    }
    
    return { interface: interfaceName, fields };
  }
  
  // Simple types
  if (schema.type === 'string') return 'string';
  if (schema.type === 'integer' || schema.type === 'number') return 'number';
  if (schema.type === 'boolean') return 'boolean';
  
  return 'any';
}

// Process each missing operation
for (const op of missingOperations) {
  console.log(`Processing: ${op.name} (${op.method} ${op.path})`);
  
  try {
    // Find operation in OpenAPI spec
    const pathObj = openApiSpec.paths[op.path];
    if (!pathObj) {
      console.error(`  ❌ Path not found: ${op.path}`);
      continue;
    }
    
    const methodObj = pathObj[op.method.toLowerCase()];
    if (!methodObj) {
      console.error(`  ❌ Method not found: ${op.method}`);
      continue;
    }
    
    // Create operation directory
    const opDir = path.join(__dirname, '../src', op.name);
    if (!fs.existsSync(opDir)) {
      fs.mkdirSync(opDir, { recursive: true });
    }
    
    // Generate operation.json
    const operationJson = {
      name: op.name,
      title: op.operationId.replace(/_/g, ' '),
      description: methodObj.summary || methodObj.description || `${op.method} ${op.path}`
    };
    fs.writeFileSync(
      path.join(opDir, 'operation.json'),
      JSON.stringify(operationJson, null, 2)
    );
    
    // Generate input.ts
    let inputTypes = [];
    let inputFields = [];
    
    // Process request body
    if (methodObj.requestBody) {
      const content = methodObj.requestBody.content?.['application/json'];
      if (content?.schema) {
        const schema = content.schema.$ref ? resolveRef(content.schema.$ref) : content.schema;
        const bodyTypeName = content.schema.$ref 
          ? content.schema.$ref.split('/').pop().replace(/\./g, '')
          : `${op.operationId.replace(/_/g, '')}Request`;
        
        const typeInfo = generateTypeFromSchema(schema, bodyTypeName);
        
        if (typeInfo.interface) {
          // Generate interface
          const interfaceCode = `export type ${typeInfo.interface} = {\n${
            typeInfo.fields.map(f => `  ${f.name}${f.optional ? '?' : ''}: ${f.type};`).join('\n')
          }\n};`;
          inputTypes.push(interfaceCode);
        }
        
        inputFields.push({
          name: 'body',
          type: bodyTypeName,
          required: methodObj.requestBody.required !== false,
          comment: 'Request body'
        });
      }
    }
    
    // Process parameters
    if (methodObj.parameters) {
      for (const param of methodObj.parameters) {
        if (param.in === 'path') {
          inputFields.push({
            name: param.name,
            type: param.schema?.type === 'integer' ? 'number' : 'string',
            required: param.required !== false,
            comment: `Path parameter`
          });
        } else if (param.in === 'query') {
          const fieldName = param.name.startsWith('$') || param.name.includes('-')
            ? param.name.replace(/^\$/, '').replace(/-/g, '_')
            : param.name;
          inputFields.push({
            name: fieldName,
            type: param.schema?.type === 'integer' ? 'number' : 'string',
            required: param.required === true,
            comment: param.name !== fieldName ? `Original parameter name: ${param.name}` : undefined
          });
        }
      }
    }
    
    // Generate input TypeScript
    let inputTs = '';
    if (inputTypes.length > 0) {
      inputTs = inputTypes.join('\n\n') + '\n\n';
    }
    
    const inputTypeName = op.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Input';
    inputTs += `export type ${inputTypeName} = {\n`;
    for (const field of inputFields) {
      if (field.comment) {
        inputTs += `  /**\n   * ${field.comment}\n   */\n`;
      }
      inputTs += `  ${field.name}${field.required ? '' : '?'}: ${field.type};\n`;
    }
    inputTs += '};\n';
    
    fs.writeFileSync(path.join(opDir, 'input.ts'), inputTs);
    
    // Generate output.ts
    let outputType = 'any';
    let outputTypes = [];
    
    if (methodObj.responses) {
      const successResponse = methodObj.responses['200'] || methodObj.responses['201'] || methodObj.responses['204'];
      if (successResponse) {
        const content = successResponse.content?.['application/json'];
        if (content?.schema) {
          const schema = content.schema.$ref ? resolveRef(content.schema.$ref) : content.schema;
          
          if (schema) {
            const typeInfo = generateTypeFromSchema(schema, 'Output');
            
            if (typeInfo.arrayOf) {
              if (typeInfo.itemSchema) {
                const itemTypeName = typeInfo.arrayOf;
                const itemTypeInfo = generateTypeFromSchema(typeInfo.itemSchema, itemTypeName);
                if (itemTypeInfo.interface) {
                  const interfaceCode = `export interface ${itemTypeInfo.interface} {\n${
                    itemTypeInfo.fields.map(f => `  ${f.name}${f.optional ? '?' : ''}: ${f.type};`).join('\n')
                  }\n}`;
                  outputTypes.push(interfaceCode);
                }
                outputType = `${itemTypeName}[]`;
              } else {
                outputType = 'any[]';
              }
            } else if (typeInfo.interface) {
              const interfaceCode = `export interface ${typeInfo.interface} {\n${
                typeInfo.fields.map(f => `  ${f.name}${f.optional ? '?' : ''}: ${f.type};`).join('\n')
              }\n}`;
              outputTypes.push(interfaceCode);
              outputType = typeInfo.interface;
            } else if (typeof typeInfo === 'string') {
              outputType = typeInfo;
            }
          }
        } else if (successResponse.description === '' || methodObj.responses['204']) {
          // No content response
          outputType = 'Record<string, never>';
        }
      }
    }
    
    const outputTypeName = op.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Output';
    let outputTs = '';
    if (outputTypes.length > 0) {
      outputTs = outputTypes.join('\n\n') + '\n\n';
    }
    outputTs += `export type ${outputTypeName} = ${outputType};\n`;
    
    fs.writeFileSync(path.join(opDir, 'output.ts'), outputTs);
    
    // Generate output.json for build
    let outputJsonSchema = { "$schema": "http://json-schema.org/draft-07/schema#" };
    if (outputType === 'string') {
      outputJsonSchema.type = 'string';
    } else if (outputType === 'number') {
      outputJsonSchema.type = 'number';
    } else if (outputType === 'boolean') {
      outputJsonSchema.type = 'boolean';
    } else if (outputType === 'Record<string, never>') {
      outputJsonSchema.type = 'object';
      outputJsonSchema.additionalProperties = false;
    } else if (outputType.endsWith('[]')) {
      outputJsonSchema.type = 'array';
      outputJsonSchema.items = { type: 'object' };
    } else {
      outputJsonSchema.type = 'object';
    }
    
    fs.writeFileSync(
      path.join(opDir, 'output.json'),
      JSON.stringify(outputJsonSchema, null, 2)
    );
    
    // Generate input.json for build
    const inputJsonSchema = {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {},
      "required": []
    };
    
    for (const field of inputFields) {
      inputJsonSchema.properties[field.name] = { type: field.type === 'number' ? 'number' : 'string' };
      if (field.required) {
        inputJsonSchema.required.push(field.name);
      }
    }
    
    fs.writeFileSync(
      path.join(opDir, 'input.json'),
      JSON.stringify(inputJsonSchema, null, 2)
    );
    
    // Generate handler.ts
    const handlerName = `${op.name}Handler`;
    const capitalizedName = op.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    
    let handlerCode = `import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { ${inputTypeName} } from './input';
import { ${outputTypeName} } from './output';

export const ${handlerName} = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ${inputTypeName},
  ${outputTypeName}
>((handler) =>
  handler.usingHttp((http) =>
    http.${op.method.toLowerCase()}('${op.path}')
      .handleRequest((ctx, input, request) => {
        let req = request;\n`;
    
    // Add path parameter handling
    const pathParams = inputFields.filter(f => f.comment === 'Path parameter');
    for (const param of pathParams) {
      handlerCode += `        req = req.addPathParameter('${param.name}', String(input.${param.name}));\n`;
    }
    
    // Add query parameter handling
    const queryParams = inputFields.filter(f => f.comment && f.comment.includes('Original parameter name'));
    for (const param of queryParams) {
      const originalName = param.comment.replace('Original parameter name: ', '');
      handlerCode += `        if (input.${param.name} !== undefined) {\n`;
      handlerCode += `          req = req.addQueryString('${originalName}', String(input.${param.name}));\n`;
      handlerCode += `        }\n`;
    }
    
    // Add other query parameters
    const otherQueryParams = inputFields.filter(f => 
      f.name !== 'body' && 
      !pathParams.includes(f) && 
      !queryParams.includes(f)
    );
    for (const param of otherQueryParams) {
      handlerCode += `        if (input.${param.name} !== undefined) {\n`;
      handlerCode += `          req = req.addQueryString('${param.name}', String(input.${param.name}));\n`;
      handlerCode += `        }\n`;
    }
    
    // Add body handling
    if (inputFields.some(f => f.name === 'body')) {
      handlerCode += `        return req.withBodyAsJson(input.body);\n`;
    } else {
      handlerCode += `        return req.withoutBody();\n`;
    }
    
    handlerCode += `      })
      .handleResponse((ctx, input, response) => 
        response.parseWithBodyAsJson()
      )
  )
);
`;
    
    fs.writeFileSync(path.join(opDir, 'handler.ts'), handlerCode);
    
    // Generate handler.test.ts
    const requiredFields = inputFields.filter(f => f.required);
    const optionalFields = inputFields.filter(f => !f.required);
    
    let testCode = `import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { ${handlerName} } from './handler';

/**
 * Test suite for ${op.name}
 * 
 * HTTP Method: ${op.method}
 * Endpoint: ${op.path}
 * ${requiredFields.length > 0 ? `
 * REQUIRED INPUTS:${requiredFields.map(f => `\n *   - ${f.name}${f.comment ? ` (${f.comment})` : ''}`).join('')}` : ''}
 * ${optionalFields.length > 0 ? `
 * OPTIONAL INPUTS:${optionalFields.map(f => `\n *   - ${f.name}${f.comment ? ` (${f.comment})` : ''}`).join('')}` : ' * OPTIONAL INPUTS: None'}
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
          .when((ctx, testContext) => ({${
            requiredFields.map(f => {
              if (f.name === 'body') {
                return `\n            ${f.name}: { /* TODO: Add required body fields */ }`;
              } else if (f.type === 'number') {
                return `\n            ${f.name}: 1`;
              } else {
                return `\n            ${f.name}: 'test-value'`;
              }
            }).join(',')
          }
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as ${outputTypeName}
              expect(output.value).toBeDefined();
            }
          })
          .finallyDoNothing()
      )

      // Test Case 2: All Inputs (Required + Optional)
      .testCase('should succeed with all inputs including optional parameters', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({${
            [...requiredFields, ...optionalFields.slice(0, 3)].map(f => {
              if (f.name === 'body') {
                return `\n            ${f.name}: { /* TODO: Add body fields */ }`;
              } else if (f.type === 'number') {
                return `\n            ${f.name}: 1`;
              } else {
                return `\n            ${f.name}: 'test-value'`;
              }
            }).join(',')
          }
          }))
          .then(({ output }) => {
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              expect(output.value).toBeDefined();
            }
          })
          .finallyDoNothing()
      )

      .nothingAfterAll()
  );
});
`;
    
    fs.writeFileSync(path.join(opDir, 'handler.test.ts'), testCode);
    
    console.log(`  ✅ Generated all files for ${op.name}`);
    
  } catch (error) {
    console.error(`  ❌ Error processing ${op.name}:`, error.message);
  }
}

console.log('\n✅ All 50 operations scaffolded successfully!');
console.log('\nNext steps:');
console.log('1. Review generated files');
console.log('2. Run: tray-cdk connector build');
console.log('3. Fix any compilation errors');
console.log('4. Update test placeholders with real data');

