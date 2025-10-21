export type AspireCloudExternalApiCompaniesModelRequestCompanyUpdateRequest = {
  CompanyName: string;
  DeniedTimeEmail?: string | null;
  Active?: boolean;
  CompanyID?: number;
};

export type CompaniesPutInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiCompaniesModelRequestCompanyUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
