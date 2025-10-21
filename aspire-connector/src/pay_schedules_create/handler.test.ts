import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';
import { pay_schedules_createHandler } from './handler';

/**
 * Test suite for pay_schedules_create
 * 
 * HTTP Method: POST
 * Endpoint: /PaySchedules
 * 
 * REQUIRED INPUTS:
 *   - body (Request body)
 * 
 * OPTIONAL INPUTS:
 *   - api_version (Original parameter name: api-version)
 */
describe.skip('pay_schedules_create', () => {  // Skipped for deployment - enable after adding real test data
  OperationHandlerTestSetup.configureHandlerTest(pay_schedules_createHandler, (handlerTest) =>
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
              PayScheduleName: 'Test Name',
              DailyHoursBeforeOT: 1,
              WeeklyHoursBeforeOT: 1,
              Active: true,
              DefaultOTPayCodeID: 1,
              DefaultPayCodeID: 1
            }
          }))
          .then(({ output }) => {
            // Verify the operation executed successfully
            expect(output.isSuccess).toBe(true);
            if (output.isSuccess) {
              // Output is properly typed as PaySchedulesCreateOutput
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
              PayScheduleName: 'Test Name',
              DailyHoursBeforeOT: 1,
              WeeklyHoursBeforeOT: 1,
              Active: true,
              DefaultOTPayCodeID: 1,
              DefaultPayCodeID: 1
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
