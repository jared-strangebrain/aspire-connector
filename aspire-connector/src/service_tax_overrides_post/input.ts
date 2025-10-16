export type ServiceTaxOverrideInsertRequest = {
  ServiceID?: number;
  StateProvinceCode: string;
  LaborTaxable?: boolean;
  MaterialTaxable?: boolean;
  EquipmentTaxable?: boolean;
  SubTaxable?: boolean;
  OtherTaxable?: boolean;
};

export type ServiceTaxOverridesPostInput = {
  /**
   * Request body
   */
  body: ServiceTaxOverrideInsertRequest;
  // Original parameter name: api-version
  api_version?: string;
};
