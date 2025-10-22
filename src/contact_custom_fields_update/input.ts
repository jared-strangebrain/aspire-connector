export type AspireCloudExternalApiContactCustomFieldsModelsContactCustomFieldUpdateRequest = {
  ContactCustomFieldValueID: number;
  ColumnValue?: string | null;
};

export type ContactCustomFieldsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiContactCustomFieldsModelsContactCustomFieldUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
