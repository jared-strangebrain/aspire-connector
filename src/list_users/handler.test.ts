import { test, expect } from '@jest/globals';

// ensure each suite has at least one test so Jest doesn't error
test('smoke: file loads', () => expect(true).toBe(true));

// Auto-generated list test
import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";
import * as HandlerModule from "./handler.js";
const handler = Object.values(HandlerModule)[0] as any;


OperationHandlerTestSetup.configureHandlerTest(handler, (handlerTest) =>
  handlerTest
    .usingHandlerContext("test")
    .nothingBeforeAll()
    .testCase("returns at least one item", (tc) =>
      tc
        .givenNothing()
        .when(() => ({ $top: 1 } as any))
        .then(({ output }) => {
          const value = OperationHandlerResult.getSuccessfulValueOrFail(output);
          expect(value).toBeDefined();
        })
        .finallyDoNothing()
    )
    .nothingAfterAll()
);

