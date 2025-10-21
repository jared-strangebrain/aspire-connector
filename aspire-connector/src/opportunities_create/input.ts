export type AspireCloudExternalApiOpportunitiesModelOpportunityInsertRequest = {
  OpportunityName: string;
  BidDueDate?: string | null;
  RenewalDate?: string | null;
  LeadSourceID?: number | null;
  SalesRepID?: number;
  AnticipatedCloseDate?: string | null;
  Probability?: number;
  DivisionID?: number;
  StartDate?: string | null;
  SalesTypeID?: number | null;
  OperationsMgrID?: number | null;
  EndDate?: string | null;
  InvoiceType?: string | null;
  MasterOpportunityID?: number | null;
  BranchID?: number | null;
  TemplateOpportunityID?: number | null;
  PropertyID?: number;
  BudgetedDollars?: number;
  EstimatedDollars?: number;
  OpportunityStatusID?: number;
  OpportunityType: string;
  OpportunityTags?: string | null;
  CustomerContractNum?: string | null;
  CustomerPONum?: string | null;
};

export type OpportunitiesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiOpportunitiesModelOpportunityInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
