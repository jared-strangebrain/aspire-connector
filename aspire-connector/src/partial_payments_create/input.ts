export type PartialPaymentInsertRequest = {
  Amount: number;
  BillingCompany?: string;
  BillingContact?: string;
  BranchName?: string;
  InvoiceNumber?: number;
  PaymentDate: string;
  PaymentMethod: string;
  PaymentNote?: string;
  PaymentReference: string;
};

export type PartialPaymentsCreateInput = {
  /**
   * Request body
   */
  body: PartialPaymentInsertRequest;
  // Original parameter name: api-version
  api_version?: string;
};
