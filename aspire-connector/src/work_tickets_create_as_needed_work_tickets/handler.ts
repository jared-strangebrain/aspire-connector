import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { WorkTicketsCreateAsNeededWorkTicketsInput } from './input';
import { WorkTicketsCreateAsNeededWorkTicketsOutput } from './output';

export const work_tickets_create_as_needed_work_ticketsHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  WorkTicketsCreateAsNeededWorkTicketsInput,
  WorkTicketsCreateAsNeededWorkTicketsOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/WorkTickets/CreateAsNeededWorkTickets')
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
