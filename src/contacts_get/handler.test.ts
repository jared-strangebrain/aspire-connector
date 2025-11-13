import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { contacts_getHandler } from './handler';

/**
 * Test suite for contacts_get
 * 
 * HTTP Method: GET
 * Endpoint: /Contacts
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
describe('contacts_get', () => {
  OperationHandlerTestSetup.configureHandlerTest(contacts_getHandler, (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      
      // Test Case 1: Minimal Required Inputs Only
      .testCase('should succeed with minimal required inputs', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({}))
          .then(({ output }) => {
            expect(output.isSuccess).toBe(true);
            const value = OperationHandlerResult.getSuccessfulValueOrFail(output);
            expect(value.contacts).toBeDefined();
            expect(Array.isArray(value.contacts)).toBe(true);
          })
          .finallyDoNothing()
      )

      // Test Case 2: All Inputs (Required + Optional)
      .testCase('should succeed with all inputs including optional parameters', (testCase) =>
        testCase
          .givenNothing()
          .when((ctx, testContext) => ({
            select: 'ContactID,FirstName,LastName',
            filter: "Active eq true",
            expand: 'ContactTags',
            orderby: 'CreatedDateTime desc',
            skip: '0',
            top: '5',
            pageNumber: '1',
            limit: '5',
            api_version: '1.0'
          }))
          .then(({ output }) => {
            expect(output.isSuccess).toBe(true);
            const value = OperationHandlerResult.getSuccessfulValueOrFail(output);
            expect(Array.isArray(value.contacts)).toBe(true);
          })
          .finallyDoNothing()
      )

      .nothingAfterAll()
  );
});
