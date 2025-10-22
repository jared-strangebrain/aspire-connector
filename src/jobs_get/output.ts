export interface Job {
  JobID?: number;
  OpportunityID?: number;
  JobStatusID?: number;
  CustomerJobNum?: string;
  CustomerPO?: string;
  CompleteDate?: string;
  CompletedUserID?: number;
  CreatedByUserName?: string;
  CancelDate?: string;
  CanceledByUserID?: number;
  CanceledFromOpportunity?: boolean;
}

export type JobsGetOutput = Job[];
