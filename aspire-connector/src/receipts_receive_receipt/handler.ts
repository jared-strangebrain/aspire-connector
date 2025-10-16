import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { ReceiptsReceiveReceiptInput } from './input';
import { ReceiptsReceiveReceiptOutput } from './output';

export const receipts_receive_receiptHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ReceiptsReceiveReceiptInput,
  ReceiptsReceiveReceiptOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/Receipts/Receive')
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
