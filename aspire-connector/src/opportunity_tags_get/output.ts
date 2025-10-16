export interface OpportunityTag {
  OpportunityTagID?: number;
  OpportunityID?: number;
  OpportunityName?: string;
  TagID?: number;
  TagName?: string;
}

export type OpportunityTagsGetOutput = OpportunityTag[];
