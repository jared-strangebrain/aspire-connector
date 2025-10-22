export type TaskRequest = {
  AssignedTo: string;
  DueDate?: string;
  Notes?: string;
  OpportunityID?: number;
  Priority?: string;
  PropertyID?: number;
  StartDate?: string;
  Subject: string;
  WorkTicketID?: number;
};

export type TasksCreateInput = {
  /**
   * Request body
   */
  body: TaskRequest;
  // Original parameter name: api-version
  api_version?: string;
};
