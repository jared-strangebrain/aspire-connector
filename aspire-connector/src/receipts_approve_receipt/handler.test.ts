import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { receipts_approve_receiptHandler } from './handler';

/**
 * Test suite for receipts_approve_receipt
 * 
 * HTTP Method: POST
 * Endpoint: /Receipts/Approve
 * 
 * REQUIRED INPUTS:
 *   - body (request body)
 * 
 * OPTIONAL INPUTS:
 *   - api-version (query parameter)
 */
describe('receipts_approve_receipt', () => {
  OperationHandlerTestSetup.configureHandlerTest(receipts_approve_receiptHandler, (handlerTest) =>
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
              // Output is properly typed as ReceiptsApproveReceiptOutput
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
