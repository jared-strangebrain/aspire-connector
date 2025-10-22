export type AspireCloudExternalApiCompaniesModelRequestCompanyInsertRequest = {
  CompanyName: string;
  DeniedTimeEmail?: string | null;
  Active?: boolean;
};

export type CompaniesPostInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiCompaniesModelRequestCompanyInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
