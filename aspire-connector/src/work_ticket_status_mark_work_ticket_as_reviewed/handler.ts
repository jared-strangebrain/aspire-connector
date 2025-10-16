import { OperationHandlerSetup } from '@trayio/cdk-dsl/connector/operation/OperationHandler';
import { AspireConnectorAuth } from '../AspireConnectorAuth';
import { WorkTicketStatusMarkWorkTicketAsReviewedInput } from './input';
import { WorkTicketStatusMarkWorkTicketAsReviewedOutput } from './output';

export const work_ticket_status_mark_work_ticket_as_reviewedHandler = OperationHandlerSetup.configureHandler<
  AspireConnectorAuth,
  WorkTicketStatusMarkWorkTicketAsReviewedInput,
  WorkTicketStatusMarkWorkTicketAsReviewedOutput
>((handler) =>
  handler.usingHttp((http) =>
    http.post('/WorkTicketStatus/MarkWorkTicketAsReviewed')
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
