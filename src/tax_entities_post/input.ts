export type AspireCloudExternalApiTaxEntitiesModelsTaxEntityInsertRequest = {
  TaxEntityName: string;
  TaxPercent?: number | null;
  Active: boolean;
};

export type TaxEntitiesPostInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiTaxEntitiesModelsTaxEntityInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
