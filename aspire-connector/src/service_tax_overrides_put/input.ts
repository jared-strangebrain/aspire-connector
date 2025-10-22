export type AspireCloudExternalApiServiceTaxOverridesModelRequestServiceTaxOverrideUpdateRequest = {
  ServiceID?: number;
  StateProvinceCode: string;
  LaborTaxable?: boolean;
  MaterialTaxable?: boolean;
  EquipmentTaxable?: boolean;
  SubTaxable?: boolean;
  OtherTaxable?: boolean;
  ServiceTaxOverrideID?: number;
};

export type ServiceTaxOverridesPutInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiServiceTaxOverridesModelRequestServiceTaxOverrideUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
