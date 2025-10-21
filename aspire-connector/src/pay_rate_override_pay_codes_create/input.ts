export type AspireCloudExternalApiPayRateOverridePayCodesModelPayRateOverridePayCodeRequest = {
  PayRateID?: number;
  PayCodeID?: number;
  OverrideRate?: number;
};

export type PayRateOverridePayCodesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPayRateOverridePayCodesModelPayRateOverridePayCodeRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
