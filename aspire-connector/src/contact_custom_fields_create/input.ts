export type AspireCloudExternalApiContactCustomFieldsModelsContactCustomFieldInsertRequest = {
  ContactCustomFieldDefinitionID: number;
  ContactID: number;
  ColumnValue?: string | null;
};

export type ContactCustomFieldsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiContactCustomFieldsModelsContactCustomFieldInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
