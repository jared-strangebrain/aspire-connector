import { OperationHandlerSetup } from "@trayio/cdk-dsl/connector/operation/OperationHandlerSetup";
import { AspireAuth } from "../AspireAuth";
import { WorkTicketVisitNotesGetInput } from "./input";
import { WorkTicketVisitNotesGetOutput } from "./output";
import { globalConfigHttp } from "../GlobalConfig";

        export const workTicketVisitNotesGetHandler = OperationHandlerSetup.configureHandler<
          AspireAuth,
          WorkTicketVisitNotesGetInput,
          WorkTicketVisitNotesGetOutput
        >((handler) =>
          handler.withGlobalConfiguration(globalConfigHttp).usingHttp((http) =>
            http
              .get("https://cloud-api.youraspire.com/WorkTicketVisitNotes")
              .handleRequest((ctx, input, request) => {let requestBuilder = request; if(input.$select) {requestBuilder = requestBuilder.addQueryString("$select", input.$select);}; if(input.$filter) {requestBuilder = requestBuilder.addQueryString("$filter", input.$filter);}; if(input.$expand) {requestBuilder = requestBuilder.addQueryString("$expand", input.$expand);}; if(input.$orderby) {requestBuilder = requestBuilder.addQueryString("$orderby", input.$orderby);}; if(input.$skip) {requestBuilder = requestBuilder.addQueryString("$skip", input.$skip);}; if(input.$top) {requestBuilder = requestBuilder.addQueryString("$top", input.$top);}; if(input.$pageNumber) {requestBuilder = requestBuilder.addQueryString("$pageNumber", input.$pageNumber);}; if(input.$limit) {requestBuilder = requestBuilder.addQueryString("$limit", input.$limit);}; if(input.api-version) {requestBuilder = requestBuilder.addQueryString("api-version", input.api-version);}; return requestBuilder.withoutBody()})
              .handleResponse((ctx, input, response) => response.parseWithBodyAsJson())
          )
        );