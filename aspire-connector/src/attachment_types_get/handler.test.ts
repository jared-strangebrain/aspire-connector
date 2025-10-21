import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import { attachment_types_getHandler } from './handler';

/**
 * Test suite for attachment_types_get
 * 
 * HTTP Method: GET
 * Endpoint: /AttachmentTypes
 * 
 * REQUIRED INPUTS: None - all inputs are optional
 * 
 * OPTIONAL INPUTS:
 *   - api-version (query parameter)
 */
describe('attachment_types_get', () => {
  OperationHandlerTestSetup.configureHandlerTest(attachment_types_getHandler, (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      
      // Test Case 1: Minimal Required Inputs Only
      .testCase('should succeed with minimal required inputs', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({}))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as AttachmentTypesGetOutput
              expect(output.value).toBeDefined();
            }
          })
          .finallyDoNothing()
      )

      // Test Case 2: All Inputs (Required + Optional)
      .testCase('should succeed with all inputs including optional parameters', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({
            api_version: 'optional-value'
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
