import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { PropertyCustomFieldsUpdateInput } from './input';
import { PropertyCustomFieldsUpdateOutput } from './output';

export const property_custom_fields_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  PropertyCustomFieldsUpdateInput,
  PropertyCustomFieldsUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/PropertyCustomFields')
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
