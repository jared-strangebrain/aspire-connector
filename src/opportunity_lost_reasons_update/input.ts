export type AspireCloudExternalApiOpportunityLostReasonModelRequestOpportunityLostReasonUpdateRequest = {
  OpportunityLostReasonName?: string | null;
  OpportunityLostReasonID: number;
  Active?: boolean | null;
};

export type OpportunityLostReasonsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiOpportunityLostReasonModelRequestOpportunityLostReasonUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
