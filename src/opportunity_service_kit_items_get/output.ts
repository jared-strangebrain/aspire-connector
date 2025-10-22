export interface OpportunityServiceKitItem {
  OpportunityServiceKitItemID?: number;
  OpportunityServiceItemID?: number;
  OpportunityServiceID?: number;
  CatalogItemID?: number;
  OpportunityServiceGroupID?: number;
  OpportunityID?: number;
  ItemName?: string;
  ItemQuantity?: number;
  ItemCost?: number;
  ItemFactor?: number;
  ItemQuantityExtended?: number;
  WastePercent?: number;
  ItemCostOrig?: number;
  ItemFactorOrig?: number;
  WastePercentOrig?: number;
  ItemCostExtended?: number;
  InvertFactor?: boolean;
  InvertFactorOrig?: boolean;
  AvailableToCrew?: boolean;
  AllocationUnitTypeID?: number;
  AllocationUnitTypeName?: string;
  TakeOffItemID?: number;
  TakeOffItemName?: string;
  ItemType?: string;
  PerPrice?: number;
  CatalogItemCategoryID?: number;
  CatalogItemCategoryName?: string;
  PerHours?: number;
  ExtendedHours?: number;
  PerHoursOrig?: number;
  Overhead?: number;
  BreakEven?: number;
  UnitPrice?: number;
  ItemQuantityUnit?: number;
  ItemQuantityExact?: number;
}

export type OpportunityServiceKitItemsGetOutput = OpportunityServiceKitItem[];
