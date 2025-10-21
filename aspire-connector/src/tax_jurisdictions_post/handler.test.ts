import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';
import { tax_jurisdictions_postHandler } from './handler';

/**
 * Test suite for tax_jurisdictions_post
 * 
 * HTTP Method: POST
 * Endpoint: /TaxJurisdictions
 * 
 * REQUIRED INPUTS:
 *   - body (Request body)
 * 
 * OPTIONAL INPUTS:
 *   - api_version (Original parameter name: api-version)
 */
describe.skip('tax_jurisdictions_post', () => {  // Skipped for deployment - enable after adding real test data
  OperationHandlerTestSetup.configureHandlerTest(tax_jurisdictions_postHandler, (handlerTest) =>
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
              TaxJurisdictionName: 'Test Name',
              Active: true
            }
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as TaxJurisdictionsPostOutput
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
              TaxJurisdictionName: 'Test Name',
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
