export type AspireCloudExternalApiPropertyModelsPropertyUpdateRequestModel = {
  PropertyName: string;
  PropertyNameAbr?: string | null;
  PropertyStatusID?: number | null;
  PropertyTags?: string | null;
  BranchID: number;
  AddressLine1?: string | null;
  AddressLine2?: string | null;
  City?: string | null;
  StateProvinceCode?: string | null;
  ZipCode?: string | null;
  CountyID?: number | null;
  TaxJurisdictionID?: number | null;
  GEOPerimeter?: number;
  SequenceNumber?: string | null;
  Budget?: number;
  AccountOwnerContactID?: number | null;
  PrimaryContactID?: number | null;
  BillingContactID?: number | null;
  ProductionManagerContactID?: number | null;
  Active?: boolean;
  SeparateInvoices?: boolean;
  EmailInvoiceFlag?: boolean;
  UpdateBranchReference?: boolean;
  PaymentTermsID?: number | null;
  IndustryID?: number | null;
  LeadSourceID?: number | null;
  CompetitorID?: number | null;
  PropertyGroupID?: number | null;
  Note?: string | null;
  ProductionNote?: string | null;
  SnowNote?: string | null;
  CollectionNotes?: string | null;
  IntegrationID?: string | null;
  PropertyTypeID?: number | null;
  PropertyID: number;
};

export type PropertiesUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPropertyModelsPropertyUpdateRequestModel;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
