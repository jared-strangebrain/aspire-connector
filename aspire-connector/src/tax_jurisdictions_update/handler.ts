import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { TaxJurisdictionsUpdateInput } from './input';
import { TaxJurisdictionsUpdateOutput } from './output';

export const tax_jurisdictions_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  TaxJurisdictionsUpdateInput,
  TaxJurisdictionsUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/TaxJurisdictions')
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
