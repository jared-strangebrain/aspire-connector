export interface RevenueVariance {
  RevenueVarianceID?: number;
  BranchID?: number;
  BranchName?: string;
  AdjustmentDate?: string;
  OpportunityID?: number;
  OpportunityNumber?: number;
  ContractYear?: number;
  DivisionID?: number;
  DivisionName?: string;
  Adjustment?: number;
  EarnedRevenue?: number;
  InvoiceRevenue?: number;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  AccountingPeriodID?: number;
}

export type RevenueVariancesGetOutput = RevenueVariance[];
