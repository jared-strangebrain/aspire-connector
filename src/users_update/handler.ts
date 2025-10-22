import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { UsersUpdateInput } from './input';
import { UsersUpdateOutput } from './output';

export const users_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  UsersUpdateInput,
  UsersUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/Users')
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
