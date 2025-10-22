export interface TakeoffItem {
  TakeoffItemID?: number;
  TakeoffGroupID?: number;
  TakeoffGroupName?: string;
  UnitTypeID?: number;
  UnitTypeName?: string;
  TakeoffItemName?: string;
  Active?: boolean;
  PrimaryTakeoff?: boolean;
  SortOrder?: number;
  TableExtenderHeaderID?: number;
  ShowInLists?: boolean;
}

export type TakeoffItemsGetOutput = TakeoffItem[];
