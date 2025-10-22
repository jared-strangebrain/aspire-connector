import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { VersionGetApiVersionInput } from './input';
import { VersionGetApiVersionOutput } from './output';

export const version_get_api_versionHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  VersionGetApiVersionInput,
  VersionGetApiVersionOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.get('/Version/GetApiVersion')
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

