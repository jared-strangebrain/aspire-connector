export type AspireCloudExternalApiPayRatesModelRequestPayRateUpdateRequest = {
  ContactID: number;
  EffectiveDate: string;
  HourlyBasePay?: number | null;
  BurdenPercent: number;
  PayRateID?: number;
};

export type PayRatesPutInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPayRatesModelRequestPayRateUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
