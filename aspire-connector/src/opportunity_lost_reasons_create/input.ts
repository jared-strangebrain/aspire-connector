export type AspireCloudExternalApiOpportunityLostReasonModelRequestOpportunityLostReasonInsertRequest = {
  OpportunityLostReasonName: string;
  Active: boolean;
};

export type OpportunityLostReasonsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiOpportunityLostReasonModelRequestOpportunityLostReasonInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
