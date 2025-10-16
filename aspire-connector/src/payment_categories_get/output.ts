export interface PaymentCategory {
  PaymentCategoryID?: number;
  PaymentCategoryName?: string;
  Active?: boolean;
  SortOrder?: number;
  AccountNumber?: string;
}

export type PaymentCategoriesGetOutput = PaymentCategory[];
