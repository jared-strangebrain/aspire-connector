import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { IssuesCreateInput } from './input';
import { IssuesCreateOutput } from './output';

export const issues_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  IssuesCreateInput,
  IssuesCreateOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/Issues')
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
