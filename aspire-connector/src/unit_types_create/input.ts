export type AspireCloudExternalApiUnitTypesModelsUnitTypeCreateRequest = {
  UnitTypeName: string;
  Active?: boolean | null;
};

export type UnitTypesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiUnitTypesModelsUnitTypeCreateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
