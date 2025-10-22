import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { ServiceTaxOverridesPutInput } from './input';
import { ServiceTaxOverridesPutOutput } from './output';

export const service_tax_overrides_putHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ServiceTaxOverridesPutInput,
  ServiceTaxOverridesPutOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/ServiceTaxOverrides')
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
