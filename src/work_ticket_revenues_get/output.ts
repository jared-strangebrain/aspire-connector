export interface WorkTicketRevenueModel {
  WorkTicketRevenueID?: number;
  WorkTicketID?: number;
  WorkTicketNumber?: number;
  RevenueMonth?: string;
  RevenueAmount?: number;
  CreatedDateTime?: string;
  EditedByUserID?: number;
  EditedByUserName?: string;
  EditedDateTime?: string;
  AccountingPeriodID?: number;
}

export type WorkTicketRevenuesGetOutput = WorkTicketRevenueModel[];
