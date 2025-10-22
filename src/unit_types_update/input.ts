export type AspireCloudExternalApiUnitTypesModelsUnitTypeUpdateRequest = {
  UnitTypeID: number;
  UnitTypeName: string;
  Active?: boolean | null;
};

export type UnitTypesUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiUnitTypesModelsUnitTypeUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
