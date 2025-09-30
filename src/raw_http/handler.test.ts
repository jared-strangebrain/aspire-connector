// raw_http test
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
    .testCase("GET /api/Contacts $top=1", (tc) =>
      tc
        .givenNothing()
        .when(() => ({
          method: "GET",
          path: "/api/Contacts",
          query: { "$top": 1, "$select": "Id" },
          response: "json"
        } as any))
        .then(({ output }) => {
          const value = OperationHandlerResult.getSuccessfulValueOrFail(output);
          expect(value).toBeDefined();
        })
        .finallyDoNothing()
    )
    .nothingAfterAll()
);
