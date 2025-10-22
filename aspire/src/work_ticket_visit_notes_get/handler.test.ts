import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
    import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
    import { workTicketVisitNotesGetHandler } from './handler';
    import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';
    
    OperationHandlerTestSetup.configureHandlerTest(workTicketVisitNotesGetHandler, (handlerTest) =>
        handlerTest
            .usingHandlerContext('test')
            .nothingBeforeAll()
            .testCase('should workTicketVisitNotesGet', (testCase) =>
                testCase
                    .givenNothing()
                    .when(() => ({ '$select': 'test', '$filter': 'test', '$expand': 'test', '$orderby': 'test', '$skip': 'test', '$top': 'test', '$pageNumber': 'test', '$limit': 'test', 'api-version': 'test' }
			))
                    .then(({ output }) => {
						// console.log(output);
                        const outputValue =
						OperationHandlerResult.getSuccessfulValueOrFail(output);
                        {}
                        
                    })
                    .finallyDoNothing()
					)
					.nothingAfterAll()
					);