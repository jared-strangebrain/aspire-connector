export type AspireCloudExternalApiTaxJurisdictionsModelTaxJurisdictionInsertRequest = {
  TaxJurisdictionName: string;
  FederalTaxPercent?: number | null;
  Active: boolean;
  TaxEntityJurisdictions?: number[] | null;
};

export type TaxJurisdictionsPostInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiTaxJurisdictionsModelTaxJurisdictionInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
