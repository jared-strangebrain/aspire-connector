export type AspireCloudExternalApiInventoryModelsAllocateFromInventoryPostRequest = {
  Quantity: number;
  CatalogItemID: number;
  InventoryLocationID: number;
  WorkTicketID: number;
  AllocationDate: string;
};

export type ItemAllocationsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiInventoryModelsAllocateFromInventoryPostRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
