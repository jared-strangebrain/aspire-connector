export interface OpportunityStatusModel {
  OpportunityStatusID?: number;
  OpportunityStatus?: string;
  OpportunityStatusName?: string;
  OpportunityStage?: string;
  OpportunityStageName?: string;
  Active?: boolean;
  Required?: boolean;
}

export type OpportunityStatusesGetOutput = OpportunityStatusModel[];
