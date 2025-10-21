import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { PropertyCustomFieldsCreateInput } from './input';
import { PropertyCustomFieldsCreateOutput } from './output';

export const property_custom_fields_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  PropertyCustomFieldsCreateInput,
  PropertyCustomFieldsCreateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/PropertyCustomFields')
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
