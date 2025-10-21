import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { tokenRequestHandler } from './handler';
import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';

// Skipped: Requires valid API credentials to test
describe.skip('#token_request', () => {
  OperationHandlerTestSetup.configureHandlerTest(
    tokenRequestHandler,
    (handlerTest) =>
    handlerTest
      .usingHandlerContext('test')
      .nothingBeforeAll()
      .testCase('should return an access token', (testCase) =>
        testCase
          .givenNothing()
          .when((test) => ({
            auth_form_input: {
              // NOTE: Update these values in test.ctx.json or use environment variables
              client_id: process.env.ASPIRE_CLIENT_ID || 'YOUR_CLIENT_ID',
              client_secret: process.env.ASPIRE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
              environment: (test.auth?.app?.environment || 'demo') as "production" | "sandbox" | "demo"
            }
          }))
          .then(({ output }) => {
            if (!output.isSuccess) {
              console.log('Token request failed:', JSON.stringify(output, null, 2));
            }
            const outputValue = OperationHandlerResult.getSuccessfulValueOrFail(output);
            expect(outputValue.body).toBeDefined();
            expect(outputValue.headers).toBeDefined();
            expect(outputValue.status_code).toBeDefined();
            expect(outputValue.status_code).toBe(200);
            expect(outputValue.body.access_token).toBeDefined();
            console.log('✅ Got access token:', outputValue.body.access_token.substring(0, 20) + '...');
          })
          .finallyDoNothing()
      )
      .nothingAfterAll()
  );
});

