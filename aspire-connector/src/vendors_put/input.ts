export type AspireCloudExternalApiVendorsModelRequestVendorUpdateRequest = {
  BranchID?: number | null;
  VendorName: string;
  AccountingVendorID?: string | null;
  BillingTerms?: string | null;
  Active?: boolean;
  VendorID?: number;
};

export type VendorsPutInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiVendorsModelRequestVendorUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
