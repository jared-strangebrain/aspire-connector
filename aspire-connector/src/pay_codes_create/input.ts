export type AspireCloudExternalApiPayCodesModelRequestPayCodeInsertRequest = {
  PayCodeName: string;
  PremiumDollars?: number | null;
  PremiumPercent?: number | null;
  FixedRate?: number | null;
  ExcludeFromOT?: boolean | null;
  PayCode?: string | null;
  OTPaycode?: boolean | null;
  Active?: boolean;
  PayCodeType?: string | null;
};

export type PayCodesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPayCodesModelRequestPayCodeInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
