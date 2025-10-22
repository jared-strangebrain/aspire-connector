import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { PayRateOverridePayCodesCreateInput } from './input';
import { PayRateOverridePayCodesCreateOutput } from './output';

export const pay_rate_override_pay_codes_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  PayRateOverridePayCodesCreateInput,
  PayRateOverridePayCodesCreateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/PayRateOverridePayCodes')
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
