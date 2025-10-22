export interface Vendor {
  VendorID?: number;
  BranchID?: number;
  BranchName?: string;
  VendorName?: string;
  AccountingVendorID?: string;
  CreatedDateTime?: string;
  Active?: boolean;
}

export type VendorsGetOutput = Vendor[];
