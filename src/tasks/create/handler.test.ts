// create operation test (skipped until payload decided)
import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";
import * as HandlerModule from "./handler.js";
const handler = Object.values(HandlerModule)[0] as any;

describe.skip("tasks/create (enable when payload ready)", () => {
  jest.setTimeout(30000);

  OperationHandlerTestSetup.configureHandlerTest(handler, (handlerTest) =>
    handlerTest
      .usingHandlerContext("test")
      .nothingBeforeAll()
      .testCase("creates a task", (tc: any) =>
        tc
          .givenNothing()
          .when(() => ({} as any)) // TODO: fill minimal valid payload for your org
          .then((res: any) => {
            const value = OperationHandlerResult.getSuccessfulValueOrFail(res.output);
            expect(value).toBeDefined();
          })
          .finallyDoNothing()
      )
      .nothingAfterAll()
  );
});
