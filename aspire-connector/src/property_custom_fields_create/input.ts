export type AspireCloudExternalApiPropertyCustomFieldsModelsPropertyCustomFieldInsertRequest = {
  PropertyCustomFieldDefinitionID: number;
  PropertyID: number;
  ColumnValue?: string | null;
};

export type PropertyCustomFieldsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPropertyCustomFieldsModelsPropertyCustomFieldInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
