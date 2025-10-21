export type AspireCloudExternalApiCatalogItemsModelRequestCatalogItemInsert = {
  CatalogItemCategoryID: number;
  ItemType: string;
  ItemName?: string | null;
  ItemAlternateName?: string | null;
  ItemDescription?: string | null;
  ItemCode?: string | null;
  ItemCost?: number | null;
  PurchaseUnitTypeID?: number | null;
  AllocationUnitTypeID?: number | null;
  UnitTypeAllocationConversion?: number;
  EPANumber?: string | null;
  EPAName?: string | null;
  Inventory?: boolean | null;
  AvailableToBid: boolean;
  Active: boolean;
  TakeoffItemID?: number | null;
  PurchaseUnitCost?: number | null;
  ForceUnitPricing?: boolean | null;
  AllocateFromMobile?: boolean | null;
  CatalogId?: number | null;
  MaterialBarcode1?: string | null;
  MaterialBarcode2?: string | null;
};

export type CatalogItemsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiCatalogItemsModelRequestCatalogItemInsert;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
