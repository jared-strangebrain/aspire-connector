import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { PartialPaymentsCreateInput } from './input';
import { PartialPaymentsCreateOutput } from './output';

export const partial_payments_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  PartialPaymentsCreateInput,
  PartialPaymentsCreateOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/PartialPayments')
      .handleRequest((ctx, input, request) => {
        let req = request;
        if (input.api_version !== undefined) {
          req = req.addQueryString('api-version', String(input.api_version));
        }
        return req.withBodyAsJson(input.body);
      })
      .handleResponse((ctx, input, response) => 
        response.parseWithBodyAsJson()
      )
  )
);
