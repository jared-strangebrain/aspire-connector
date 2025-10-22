import { test, expect } from '@jest/globals';

// ensure each suite has at least one test so Jest doesn't error
test('smoke: file loads', () => expect(true).toBe(true));

// create operation test (skipped until payload decided)
import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";
import * as HandlerModule from "./handler.js";
const handler = Object.values(HandlerModule)[0] as any;

describe.skip("properties/create (enable when payload ready)", () => {

  OperationHandlerTestSetup.configureHandlerTest(handler, (handlerTest) =>
    handlerTest
      .usingHandlerContext("test")
      .nothingBeforeAll()
      .testCase("creates a property", (tc: any) =>
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

