export interface CatalogItem {
  CatalogItemID?: number;
  CatalogItemCategoryID?: number;
  ItemType?: string;
  ItemName?: string;
  ItemAlternateName?: string;
  ItemDescription?: string;
  ItemCode?: string;
  ItemCost?: number;
  PurchaseUnitTypeID?: number;
  PurchaseUnitTypeName?: string;
  AllocationUnitTypeID?: number;
  AllocationUnitTypeName?: string;
  UnitTypeAllocationConversion?: number;
  EPANumber?: string;
  EPAName?: string;
  Inventory?: boolean;
  AvailableToBid?: boolean;
  Active?: boolean;
  LastUpdatedDateTime?: string;
  LastUpdatedByUserID?: number;
  LastUpdatedByUserName?: string;
  PurchaseUnitCost?: number;
  ForceUnitPricing?: boolean;
  AllocateFromMobile?: boolean;
  CatalogId?: number;
  CatalogName?: string;
  TakeoffItemID?: number;
  CatalogItemBranches?: any[];
  AllBranches?: boolean;
  MaterialBarcode1?: string;
  MaterialBarcode2?: string;
}

export type CatalogItemsGetOutput = CatalogItem[];
