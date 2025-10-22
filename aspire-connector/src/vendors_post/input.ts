export type AspireCloudExternalApiVendorsModelRequestVendorInsertRequest = {
  BranchID?: number | null;
  VendorName: string;
  AccountingVendorID?: string | null;
  BillingTerms?: string | null;
  Active?: boolean;
};

export type VendorsPostInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiVendorsModelRequestVendorInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
