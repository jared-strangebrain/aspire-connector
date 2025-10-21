import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';
import { localities_createHandler } from './handler';

/**
 * Test suite for localities_create
 * 
 * HTTP Method: POST
 * Endpoint: /Localities
 * 
 * REQUIRED INPUTS:
 *   - body (Request body)
 * 
 * OPTIONAL INPUTS:
 *   - api_version (Original parameter name: api-version)
 */
describe.skip('localities_create', () => {  // Skipped for deployment - enable after adding real test data
  OperationHandlerTestSetup.configureHandlerTest(localities_createHandler, (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      
      // Test Case 1: Minimal Required Inputs Only
      .testCase('should succeed with minimal required inputs', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => (// NOTE: May need to update IDs and values for your specific API instance
          {
            body: {
              LocalityName: 'Test Name',
              Active: true
            }
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as LocalitiesCreateOutput
              expect(output.value).toBeDefined();
            }
          })
          .finallyDoNothing()
      )

      // Test Case 2: All Inputs (Required + Optional)
      .testCase('should succeed with all inputs including optional parameters', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => (// NOTE: May need to update IDs and values for your specific API instance
          {
            body: {
              LocalityName: 'Test Name',
              Active: true
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
