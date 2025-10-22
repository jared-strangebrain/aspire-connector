export type AspireCloudExternalApiPropertyAvailabilityModelsPropertyAvailabilityRequestModel = {
  AvailabilityTimes?: any[] | null;
  PropertyId: number;
};

export type PropertyAvailabilitiesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPropertyAvailabilityModelsPropertyAvailabilityRequestModel;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
