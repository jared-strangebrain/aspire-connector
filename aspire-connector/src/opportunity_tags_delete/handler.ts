import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { OpportunityTagsDeleteInput } from './input';
import { OpportunityTagsDeleteOutput } from './output';

export const opportunity_tags_deleteHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  OpportunityTagsDeleteInput,
  OpportunityTagsDeleteOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.delete('/OpportunityTags/{id}')
      .handleRequest((ctx, input, request) => {
        let req = request;
        req = req.addPathParameter('id', String(input.id));
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
