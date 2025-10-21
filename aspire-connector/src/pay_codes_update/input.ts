export type AspireCloudExternalApiPayCodesModelRequestPayCodeUpdateRequest = {
  PayCodeName: string;
  PremiumDollars?: number | null;
  PremiumPercent?: number | null;
  FixedRate?: number | null;
  ExcludeFromOT?: boolean | null;
  PayCode?: string | null;
  OTPaycode?: boolean | null;
  Active?: boolean;
  PayCodeID: number;
};

export type PayCodesUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPayCodesModelRequestPayCodeUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
