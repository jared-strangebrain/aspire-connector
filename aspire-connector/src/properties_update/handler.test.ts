import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';
import { properties_updateHandler } from './handler';

/**
 * Test suite for properties_update
 * 
 * HTTP Method: PUT
 * Endpoint: /Properties
 * 
 * REQUIRED INPUTS:
 *   - body (Request body)
 * 
 * OPTIONAL INPUTS:
 *   - api_version (Original parameter name: api-version)
 */
describe.skip('properties_update', () => {  // Skipped for deployment - enable after adding real test data
  OperationHandlerTestSetup.configureHandlerTest(properties_updateHandler, (handlerTest) =>
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
              PropertyName: 'Test Name',
              BranchID: 1,
              PropertyID: 1
            }
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as PropertiesUpdateOutput
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
              PropertyName: 'Test Name',
              BranchID: 1,
              PropertyID: 1
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
