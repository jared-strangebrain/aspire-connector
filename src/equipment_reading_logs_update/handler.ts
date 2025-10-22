import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { EquipmentReadingLogsUpdateInput } from './input';
import { EquipmentReadingLogsUpdateOutput } from './output';

export const equipment_reading_logs_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  EquipmentReadingLogsUpdateInput,
  EquipmentReadingLogsUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/EquipmentReadingLogs')
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
