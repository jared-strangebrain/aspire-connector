export interface Branch {
  BranchID?: number;
  BranchName?: string;
  Active?: boolean;
  InternalPropertyID?: number;
  InternalPropertyName?: string;
  CatalogPriceListName?: string;
  BranchAddressID?: number;
  BranchAddressLine1?: string;
  BranchAddressLine2?: string;
  BranchAddressCity?: string;
  BranchAddressStateProvinceCode?: string;
  BranchAddressZipCode?: string;
  BranchPhone?: string;
  BranchFax?: string;
  BranchCode?: string;
  BranchManagerContactID?: number;
  BranchManagerContactName?: string;
  LegalName?: string;
  TimeZone?: string;
  InvoiceNumberPrefix?: string;
  ReceiptNumberPrefix?: string;
  OpportunityNumberPrefix?: string;
  RegionID?: number;
  RegionName?: string;
  BillingEmailFromAccountOwner?: boolean;
  BillingEmailFromUserName?: string;
  BillingEmailFromEmail?: string;
  BillingEmailSubject?: string;
  BillingEmailBody?: string;
  InvoiceOnCompletionDescription?: string;
  BranchWebSite?: string;
  CatalogPriceListID?: number;
  BillingEmailCC?: string;
}

export type BranchesGetOutput = Branch[];
