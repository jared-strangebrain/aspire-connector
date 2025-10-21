import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import { version_get_api_versionHandler } from './handler';

/**
 * Test suite for version_get_api_version
 * 
 * HTTP Method: GET
 * Endpoint: /Version/GetApiVersion
 * 
 * REQUIRED INPUTS: None - all inputs are optional
 * 
 * OPTIONAL INPUTS:
 *   - api-version (query parameter)
 */
describe('version_get_api_version', () => {
  OperationHandlerTestSetup.configureHandlerTest(version_get_api_versionHandler, (handlerTest) =>
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
              // Output is properly typed as VersionGetApiVersionOutput
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
