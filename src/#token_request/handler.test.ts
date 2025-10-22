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
            // For Token Based auth, inputs are passed directly (not in auth_form_input)
            client_id: process.env.ASPIRE_CLIENT_ID || 'YOUR_CLIENT_ID',
            client_secret: process.env.ASPIRE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
            environment: (test.auth?.app?.environment || 'demo') as "production" | "sandbox" | "demo"
          }))
          .then(({ output }) => {
            if (!output.isSuccess) {
              console.log('Token request failed:', JSON.stringify(output, null, 2));
            }
            const outputValue = OperationHandlerResult.getSuccessfulValueOrFail(output);
            expect(outputValue.access_token).toBeDefined();
            expect(outputValue.token_type).toBe('Bearer');
            expect(outputValue.expires_in).toBe(86400);
            console.log('✅ Got access token:', outputValue.access_token.substring(0, 20) + '...');
          })
          .finallyDoNothing()
      )
      .nothingAfterAll()
  );
});

