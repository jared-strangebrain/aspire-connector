import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { opportunity_tags_deleteHandler } from './handler';

/**
 * Test suite for opportunity_tags_delete
 * 
 * HTTP Method: DELETE
 * Endpoint: /OpportunityTags/{id}
 * 
 * REQUIRED INPUTS:
 *   - id (path parameter)
 * 
 * OPTIONAL INPUTS:
 *   - api-version (query parameter)
 */
describe('opportunity_tags_delete', () => {
  OperationHandlerTestSetup.configureHandlerTest(opportunity_tags_deleteHandler, (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      
      // Test Case 1: Minimal Required Inputs Only
      .testCase('should succeed with minimal required inputs', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({
            id: 1
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as OpportunityTagsDeleteOutput
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
            id: 1,
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
