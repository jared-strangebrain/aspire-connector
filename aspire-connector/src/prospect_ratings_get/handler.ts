import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { ProspectRatingsGetInput } from './input';
import { ProspectRatingsGetOutput } from './output';

export const prospect_ratings_getHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  ProspectRatingsGetInput,
  ProspectRatingsGetOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.get('/ProspectRatings')
      .handleRequest((ctx, input, request) => {
        let req = request;
        if (input.select !== undefined) {
          req = req.addQueryString('$select', String(input.select));
        }
        if (input.filter !== undefined) {
          req = req.addQueryString('$filter', String(input.filter));
        }
        if (input.expand !== undefined) {
          req = req.addQueryString('$expand', String(input.expand));
        }
        if (input.orderby !== undefined) {
          req = req.addQueryString('$orderby', String(input.orderby));
        }
        if (input.skip !== undefined) {
          req = req.addQueryString('$skip', String(input.skip));
        }
        if (input.top !== undefined) {
          req = req.addQueryString('$top', String(input.top));
        }
        if (input.pageNumber !== undefined) {
          req = req.addQueryString('$pageNumber', String(input.pageNumber));
        }
        if (input.limit !== undefined) {
          req = req.addQueryString('$limit', String(input.limit));
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
