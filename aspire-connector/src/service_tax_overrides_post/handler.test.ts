import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { service_tax_overrides_postHandler } from './handler';

/**
 * Test suite for service_tax_overrides_post
 * 
 * HTTP Method: POST
 * Endpoint: /ServiceTaxOverrides
 * 
 * REQUIRED INPUTS:
 *   - body (request body)
 * 
 * OPTIONAL INPUTS:
 *   - api-version (query parameter)
 */
describe('service_tax_overrides_post', () => {
  OperationHandlerTestSetup.configureHandlerTest(service_tax_overrides_postHandler, (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      
      // Test Case 1: Minimal Required Inputs Only
      .testCase('should succeed with minimal required inputs', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({
            body: { /* Request body fields */ }
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as ServiceTaxOverridesPostOutput
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
            api_version: 'optional-value',
            body: { /* Request body fields */ }
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
