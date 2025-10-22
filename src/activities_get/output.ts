export interface Activity {
  ActivityID?: number;
  PropertyID?: number;
  OpportunityID?: number;
  WorkTicketID?: number;
  ActivityType?: string;
  Status?: string;
  Subject?: string;
  Location?: string;
  IncludeClient?: boolean;
  IncludeCrew?: boolean;
  Notes?: string;
  Priority?: string;
  StartDate?: string;
  EndDate?: string;
  DueDate?: string;
  CompleteDate?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDate?: string;
  SentDate?: string;
  ActivityNumber?: number;
  InvoiceID?: number;
  PaymentID?: number;
  Private?: boolean;
  CompletedByUserID?: number;
  CompletedByUserName?: string;
  IsMileStone?: boolean;
  ModifiedDate?: string;
  ActivityCategoryID?: number;
  ActivityCategoryName?: string;
}

export type ActivitiesGetOutput = Activity[];
