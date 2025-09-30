// verify_connection test
import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";
import * as HandlerModule from "./handler.js";
const handler = Object.values(HandlerModule)[0] as any;

jest.setTimeout(30000);

OperationHandlerTestSetup.configureHandlerTest(handler, (handlerTest) =>
  handlerTest
    .usingHandlerContext("test")
    .nothingBeforeAll()
    .testCase("can fetch /api/Contacts", (tc) =>
      tc
        .givenNothing()
        .when(() => ({ $top: 1, $select: "Id" } as any))
        .then(({ output }) => {
          const value = OperationHandlerResult.getSuccessfulValueOrFail(output);
          expect(value).toBeDefined();
        })
        .finallyDoNothing()
    )
    .nothingAfterAll()
);
