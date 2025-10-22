export interface PayRate {
  PayRateID?: number;
  ContactID?: number;
  ContactName?: string;
  EffectiveDate?: string;
  HourlyBasePay?: number;
  BurdenPercent?: number;
}

export type PayRatesGetOutput = PayRate[];
