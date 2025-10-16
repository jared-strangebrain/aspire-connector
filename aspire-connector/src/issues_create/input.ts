export type IssueRequest = {
  AssignedTo: string;
  DueDate?: string;
  Notes: string;
  OpportunityID?: number;
  Priority?: string;
  PropertyID?: number;
  StartDate?: string;
  Subject: string;
  WorkTicketID?: number;
  IncludeClient?: boolean;
  PublicComment?: boolean;
};

export type IssuesCreateInput = {
  /**
   * Request body
   */
  body: IssueRequest;
  // Original parameter name: api-version
  api_version?: string;
};
