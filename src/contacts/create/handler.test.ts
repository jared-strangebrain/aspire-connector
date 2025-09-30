// create operation test (skipped until payload decided)
import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";
import * as HandlerModule from "./handler.js";
const handler = Object.values(HandlerModule)[0] as any;

describe.skip("create operation (enable when payload ready)", () => {
  jest.setTimeout(30000);

  OperationHandlerTestSetup.configureHandlerTest(handler, (handlerTest) =>
    handlerTest
      .usingHandlerContext("test")
      .nothingBeforeAll()               // ✅ required before .testCase(...)
      .testCase("creates a record", (tc: any) =>   // give tc an explicit type
        tc
          .givenNothing()
          .when(() => ({} as any))      // TODO: fill minimal valid payload for your org
          .then((res: any) => {         // avoid destructuring to dodge implicit any
            const value = OperationHandlerResult.getSuccessfulValueOrFail(res.output);
            expect(value).toBeDefined();
          })
          .finallyDoNothing()
      )
      .nothingAfterAll()                // ✅ symmetrical with .nothingBeforeAll()
  );
});
