import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { ContactCustomFieldsUpdateInput } from './input';
import { ContactCustomFieldsUpdateOutput } from './output';

export const contact_custom_fields_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ContactCustomFieldsUpdateInput,
  ContactCustomFieldsUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/ContactCustomFields')
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
