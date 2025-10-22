import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { AttachmentsNewLinkInput } from './input';
import { AttachmentsNewLinkOutput } from './output';

export const attachments_new_linkHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  AttachmentsNewLinkInput,
  AttachmentsNewLinkOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.get('/Attachments/NewLink')
      .handleRequest((ctx, input, request) => {
        let req = request;
        if (input.link !== undefined) {
          req = req.addQueryString('link', String(input.link));
        }
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

