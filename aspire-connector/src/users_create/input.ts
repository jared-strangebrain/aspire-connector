export type AspireCloudExternalApiUsersModelsUserInsertRequest = {
  AllBranchAccess: boolean;
  BranchAccess?: number[] | null;
  ExternalContactReference: string;
  Password: string;
  Active: boolean;
  UserRoles: number[];
};

export type UsersCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiUsersModelsUserInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
