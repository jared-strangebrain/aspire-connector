import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { UsersCreateInput } from './input';
import { UsersCreateOutput } from './output';

export const users_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  UsersCreateInput,
  UsersCreateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/Users')
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
