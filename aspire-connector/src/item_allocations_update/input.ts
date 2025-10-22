export type AspireCloudExternalApiInventoryModelsAllocateFromInventoryPutRequest = {
  Quantity: number;
  CatalogItemID: number;
  InventoryLocationID: number;
  WorkTicketID: number;
  AllocationDate: string;
  ItemAllocationId: number;
};

export type ItemAllocationsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiInventoryModelsAllocateFromInventoryPutRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
