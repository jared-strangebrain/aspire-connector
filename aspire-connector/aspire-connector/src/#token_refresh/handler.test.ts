import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { tokenRefreshHandler } from './handler';
import { TokenRefreshInput } from './input';

describe.skip('#token_refresh handler', () => {
  it('should refresh the access token', async () => {
    const result = await OperationHandlerTestSetup.test(
      tokenRefreshHandler,
      {} as TokenRefreshInput,
      {} as any
    );
    expect(OperationHandlerResult.isSuccess(result)).toBe(true);
  });
});
