import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { EquipmentReadingLogsCreateInput } from './input';
import { EquipmentReadingLogsCreateOutput } from './output';

export const equipment_reading_logs_createHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  EquipmentReadingLogsCreateInput,
  EquipmentReadingLogsCreateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/EquipmentReadingLogs')
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
