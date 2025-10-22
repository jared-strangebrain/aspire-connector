import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandlerSetup';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { globalConfigHttp } from '../GlobalConfig';
import { CatalogItemsUpdateInput } from './input';
import { CatalogItemsUpdateOutput } from './output';

export const catalog_items_updateHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  CatalogItemsUpdateInput,
  CatalogItemsUpdateOutput
>((handler) =>
  handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
    http.put('/CatalogItems')
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
