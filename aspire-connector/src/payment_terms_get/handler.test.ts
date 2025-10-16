import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { payment_terms_getHandler } from './handler';

/**
 * Test suite for payment_terms_get
 * 
 * HTTP Method: GET
 * Endpoint: /PaymentTerms
 * 
 * REQUIRED INPUTS: None - all inputs are optional
 * 
 * OPTIONAL INPUTS:
 *   - $select (query parameter)
 *   - $filter (query parameter)
 *   - $expand (query parameter)
 *   - $orderby (query parameter)
 *   - $skip (query parameter)
 *   - $top (query parameter)
 *   - $pageNumber (query parameter)
 *   - $limit (query parameter)
 *   - api-version (query parameter)
 */
describe('payment_terms_get', () => {
  OperationHandlerTestSetup.configureHandlerTest(payment_terms_getHandler, (handlerTest) =>
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
              // Output is properly typed as PaymentTermsGetOutput
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
            select: 'optional-value',
            filter: 'optional-value',
            expand: 'optional-value'
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
