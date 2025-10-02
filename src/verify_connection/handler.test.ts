// src/verify_connection/handler.test.ts
import { test, expect } from '@jest/globals';

test('smoke: file loads', () => expect(true).toBe(true));

import { OperationHandlerTestSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerTest";
import { OperationHandlerResult } from "@trayio/cdk-dsl/connector/operation/OperationHandler";
import "@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner";

// ✅ Prefer the named export; fall back to __impl if needed
import { verifyConnectionHandler, __impl as verifyImpl } from "./handler.js";
const handler: any = (verifyConnectionHandler as any) ?? (verifyImpl as any);

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
