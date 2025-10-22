export interface PayCodeModel {
  PayCodeID?: number;
  PayCodeName?: string;
  PremiumDollars?: number;
  PremiumPercent?: number;
  FixedRate?: number;
  ExcludeFromOT?: boolean;
  PayCode?: string;
  OTPaycode?: boolean;
  Active?: boolean;
  PayCodeType?: string;
}

export type PayCodesGetOutput = PayCodeModel[];
