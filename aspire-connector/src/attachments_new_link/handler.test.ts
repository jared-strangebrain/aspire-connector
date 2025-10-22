import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import { attachments_new_linkHandler } from './handler';

/**
 * Test suite for attachments_new_link
 * 
 * HTTP Method: GET
 * Endpoint: /Attachments/NewLink
 * 
 * REQUIRED INPUTS: None - all inputs are optional
 * 
 * OPTIONAL INPUTS:
 *   - link (query parameter)
 *   - api-version (query parameter)
 */
describe('attachments_new_link', () => {
  OperationHandlerTestSetup.configureHandlerTest(attachments_new_linkHandler, (handlerTest) =>
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
              // Output is properly typed as AttachmentsNewLinkOutput
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
            link: 'optional-value',
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
