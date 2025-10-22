export type AspireCloudExternalApiPayRatesModelRequestPayRateInsertRequest = {
  ContactID: number;
  EffectiveDate: string;
  HourlyBasePay?: number | null;
  BurdenPercent: number;
};

export type PayRatesPostInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPayRatesModelRequestPayRateInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
