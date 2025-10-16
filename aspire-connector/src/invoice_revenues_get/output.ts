export interface InvoiceRevenue {
  InvoiceRevenueID?: number;
  InvoiceOpportunityID?: number;
  InvoiceID?: number;
  InvoiceDate?: string;
  BranchID?: number;
  BranchName?: string;
  DivisionID?: number;
  DivisionName?: string;
  Amount?: number;
  InvoiceBatchID?: number;
  DivisionCode?: string;
  InvoiceNumber?: number;
}

export type InvoiceRevenuesGetOutput = InvoiceRevenue[];
