export type AspireCloudExternalApiTaxEntitiesModelsTaxEntityUpdateRequest = {
  TaxEntityName: string;
  TaxPercent?: number | null;
  Active: boolean;
  TaxEntityID: number;
};

export type TaxEntitiesUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiTaxEntitiesModelsTaxEntityUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
