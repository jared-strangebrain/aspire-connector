import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { ReceiptsApproveReceiptInput } from './input';
import { ReceiptsApproveReceiptOutput } from './output';

export const receipts_approve_receiptHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ReceiptsApproveReceiptInput,
  ReceiptsApproveReceiptOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.post('/Receipts/Approve')
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

