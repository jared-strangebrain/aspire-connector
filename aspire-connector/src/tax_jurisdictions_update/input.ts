export type AspireCloudExternalApiTaxJurisdictionsModelTaxJurisdictionUpdateRequest = {
  TaxJurisdictionName: string;
  FederalTaxPercent?: number | null;
  Active: boolean;
  TaxEntityJurisdictions?: number[] | null;
  TaxJurisdictionID: number;
};

export type TaxJurisdictionsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiTaxJurisdictionsModelTaxJurisdictionUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
