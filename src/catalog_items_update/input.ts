export type AspireCloudExternalApiCatalogItemsModelRequestCatalogItemBranch = {
  CatalogItemBranchID?: number;
  BranchID?: number;
  BranchName?: string | null;
};

export type AspireCloudExternalApiCatalogItemsModelRequestCatalogItemUpdate = {
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
  CatalogItemID?: number;
  CatalogItemBranches?: AspireCloudExternalApiCatalogItemsModelRequestCatalogItemBranch[] | null;
};

export type CatalogItemsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiCatalogItemsModelRequestCatalogItemUpdate;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
