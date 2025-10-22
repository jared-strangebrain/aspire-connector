export interface Company {
  CompanyID?: number;
  CompanyName?: string;
  CreatedDateTime?: string;
  CreatedByUserName?: string;
  ModifiedDateTime?: string;
  ModifiedByUserName?: string;
  DeniedTimeEmail?: string;
  Active?: boolean;
  CreatedByUserID?: number;
  ModifiedByUserID?: number;
  EarliestOpportunityWonDate?: string;
}

export type CompaniesGetOutput = Company[];
