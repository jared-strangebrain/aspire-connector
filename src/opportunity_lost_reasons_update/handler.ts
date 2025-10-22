import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { OpportunityLostReasonsUpdateInput } from './input';
import { OpportunityLostReasonsUpdateOutput } from './output';

export const opportunity_lost_reasons_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  OpportunityLostReasonsUpdateInput,
  OpportunityLostReasonsUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/OpportunityLostReasons')
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
