export type AspireCloudExternalApiReceiptsModelReceiptPost = {
  ReceiptID?: number;
  BranchID: number;
  VendorID: number;
  VendorInvoiceNum?: string | null;
  VendorInvoiceDate?: string | null;
  WorkTicketID?: number | null;
  ReceiptNote?: string | null;
  AddressLine1?: string | null;
  AddressLine2?: string | null;
  City?: string | null;
  StateProvinceCode?: string | null;
  ZipCode?: string | null;
  InventoryLocationID?: number | null;
  ReceiptTotalCost?: number;
  ReceiptItems?: any[] | null;
  ReceiptExtraCosts?: any[] | null;
};

export type ReceiptsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiReceiptsModelReceiptPost;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
