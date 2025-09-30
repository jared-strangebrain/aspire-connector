// token_request test (skipped until client/refresh creds provided)
import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";
import * as HandlerModule from "./handler.js";
const handler = Object.values(HandlerModule)[0] as any;

describe.skip("token_request (enable when creds ready)", () => {
  OperationHandlerTestSetup.configureHandlerTest(handler, (handlerTest) =>
    handlerTest
      .usingHandlerContext("test")
      .nothingBeforeAll()
      .testCase("exchanges/refreshes token", (tc: any) =>
        tc
          .givenNothing()
          .when(() => ({
            // TODO: grant_type, refresh_token, client_id, client_secret, etc.
          } as any))
          .then((_res: any) => {
            // Fill assertions once real flow is wired
          })
          .finallyDoNothing()
      )
      .nothingAfterAll()
  );
});
