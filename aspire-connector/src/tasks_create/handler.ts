import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { TasksCreateInput } from './input';
import { TasksCreateOutput } from './output';

export const tasks_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  TasksCreateInput,
  TasksCreateOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/Tasks')
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
