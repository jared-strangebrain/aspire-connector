import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { AuthorizationRefreshTokenInput } from './input';
import { AuthorizationRefreshTokenOutput } from './output';

export const authorization_refresh_tokenHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  AuthorizationRefreshTokenInput,
  AuthorizationRefreshTokenOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/Authorization/RefreshToken')
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

