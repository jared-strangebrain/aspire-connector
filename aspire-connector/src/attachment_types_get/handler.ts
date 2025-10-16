import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { AttachmentTypesGetInput } from './input';
import { AttachmentTypesGetOutput } from './output';

export const attachment_types_getHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  AttachmentTypesGetInput,
  AttachmentTypesGetOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.get('/AttachmentTypes')
      .handleRequest((ctx, input, request) => {
        let req = request;
        if (input.api_version !== undefined) {
          req = req.addQueryString('api-version', String(input.api_version));
        }
        return req.withoutBody();
      })
      .handleResponse((ctx, input, response) => 
        response.parseWithBodyAsJson()
      )
  )
);
