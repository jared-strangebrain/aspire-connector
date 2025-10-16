import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { AuthorizationAuthenticateApiRequestInput } from './input';
import { AuthorizationAuthenticateApiRequestOutput } from './output';

export const authorization_authenticate_api_requestHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  AuthorizationAuthenticateApiRequestInput,
  AuthorizationAuthenticateApiRequestOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/Authorization')
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
