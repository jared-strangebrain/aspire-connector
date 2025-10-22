export interface OpportunityLostReason {
  OpportunityLostReasonID?: number;
  OpportunityLostReasonName?: string;
  Active?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByDateTime?: string;
  LastModifiedByUserName?: string;
}

export type OpportunityLostReasonsGetOutput = OpportunityLostReason[];
