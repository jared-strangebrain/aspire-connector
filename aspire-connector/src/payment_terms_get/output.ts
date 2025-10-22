export interface PaymentTerms {
  PaymentTermsID?: number;
  Terms?: string;
  NumberOfDays?: number;
  Active?: boolean;
}

export type PaymentTermsGetOutput = PaymentTerms[];
