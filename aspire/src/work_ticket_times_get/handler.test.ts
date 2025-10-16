import { OperationHandlerTestSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerTest';
    import { OperationHandlerResult } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
    import { workTicketTimesGetHandler } from './handler';
    import '@trayio/cdk-runtime/connector/operation/OperationHandlerTestRunner';
    
    OperationHandlerTestSetup.configureHandlerTest(workTicketTimesGetHandler, (handlerTest) =>
        handlerTest
            .usingHandlerContext('test')
            .nothingBeforeAll()
            .testCase('should workTicketTimesGet', (testCase) =>
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