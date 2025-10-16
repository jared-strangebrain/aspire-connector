export interface InvoiceTax {
  Amount?: number;
  InvoiceDate?: string;
  InvoiceID?: number;
  InvoiceTaxID?: number;
  TaxEntityID?: number;
  TaxEntityName?: string;
  PaymentID?: number;
  InvoiceBatchID?: number;
  InvoiceNumber?: number;
}

export type InvoiceTaxesGetOutput = InvoiceTax[];
