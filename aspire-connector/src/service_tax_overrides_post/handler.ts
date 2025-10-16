import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { ServiceTaxOverridesPostInput } from './input';
import { ServiceTaxOverridesPostOutput } from './output';

export const service_tax_overrides_postHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ServiceTaxOverridesPostInput,
  ServiceTaxOverridesPostOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/ServiceTaxOverrides')
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
