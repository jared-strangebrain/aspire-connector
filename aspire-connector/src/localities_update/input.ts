export type AspireCloudExternalApiCountiesModelLocalityUpdateRequest = {
  LocalityName: string;
  LocalCode?: string | null;
  Active: boolean;
  LocalityID: number;
};

export type LocalitiesUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiCountiesModelLocalityUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
