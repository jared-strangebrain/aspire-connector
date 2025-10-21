export type AspireCloudExternalApiUsersModelsUserUpdateRequest = {
  UserId: number;
  AllBranchAccess: boolean;
  BranchAccess?: number[] | null;
  Password?: string | null;
  Active: boolean;
  UserRoles: number[];
};

export type UsersUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiUsersModelsUserUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
