export type AspireCloudExternalApiCountiesModelLocalityInsertRequest = {
  LocalityName: string;
  LocalCode?: string | null;
  Active: boolean;
};

export type LocalitiesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiCountiesModelLocalityInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
