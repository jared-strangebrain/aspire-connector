import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { PropertyAvailabilitiesCreateInput } from './input';
import { PropertyAvailabilitiesCreateOutput } from './output';

export const property_availabilities_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  PropertyAvailabilitiesCreateInput,
  PropertyAvailabilitiesCreateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/PropertyAvailabilities')
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
