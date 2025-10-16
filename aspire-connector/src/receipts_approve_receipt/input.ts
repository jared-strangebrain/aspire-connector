export type ApproveReceiptRequest = {
  ReceiptID?: number;
  Receive?: boolean;
  VendorInvoiceNum?: string;
  VendorInvoiceDate?: string;
};

export type ReceiptsApproveReceiptInput = {
  /**
   * Request body
   */
  body: ApproveReceiptRequest;
  // Original parameter name: api-version
  api_version?: string;
};
