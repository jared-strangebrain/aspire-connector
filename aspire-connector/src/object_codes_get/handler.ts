import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { ObjectCodesGetInput } from './input';
import { ObjectCodesGetOutput } from './output';

export const object_codes_getHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ObjectCodesGetInput,
  ObjectCodesGetOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.get('/ObjectCodes')
      .handleRequest((ctx, input, request) => {
        let req = request;
        if (input.api_version !== undefined) {
          req = req.addQueryString('api-version', String(input.api_version));
        }
        return req.withoutBody();
      })
      .handleResponse((ctx, input, response) => 
        response.parseWithBodyAsJson()
      )
  )
);
