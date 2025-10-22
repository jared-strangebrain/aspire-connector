import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { ClockTimesCreateInput } from './input';
import { ClockTimesCreateOutput } from './output';

export const clock_times_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ClockTimesCreateInput,
  ClockTimesCreateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/ClockTimes')
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
