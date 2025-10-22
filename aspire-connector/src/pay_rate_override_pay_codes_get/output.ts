export interface PayRateOverridePayCode {
  PayRateOverridePayCodeID?: number;
  PayRateID?: number;
  PayCodeID?: number;
  OverrideRate?: number;
  ContactID?: number;
}

export type PayRateOverridePayCodesGetOutput = PayRateOverridePayCode[];
