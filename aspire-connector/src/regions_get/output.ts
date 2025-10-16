export interface Region {
  RegionID?: number;
  RegionName?: string;
  LegalName?: string;
  AddressID?: number;
  AddressLine1?: string;
  AddressLine2?: string;
  AddressCity?: string;
  AddressStateProvinceCode?: string;
  AddressZipCode?: string;
  ManagerContactID?: number;
  ManagerName?: string;
  BillingEmailFromAccountOwner?: boolean;
  BillingEmailFromUserID?: number;
  BillingEmailFromUserName?: string;
  BillingEmailAddress?: string;
  BillingEmailCC?: string;
  BillingEmailSubject?: string;
  BillingEmailBody?: string;
  InvoiceOnCompletionDescription?: string;
  RegionPhoneNumber?: string;
  RegionFaxNumber?: string;
  DistrictID?: number;
  DistrictName?: string;
}

export type RegionsGetOutput = Region[];
