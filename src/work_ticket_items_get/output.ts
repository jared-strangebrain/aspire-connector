export interface WorkTicketItemModel {
  WorkTicketItemID?: number;
  CatalogItemID?: number;
  ItemName?: string;
  ItemType?: string;
  AllocationUnitTypeID?: number;
  AllocationUnitTypeName?: string;
  ItemQuantityExtended?: number;
  ItemCost?: number;
  ShowOnTicket?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  CatalogItemCategoryID?: number;
  CatalogItemCategoryName?: string;
  DoNotPurchase?: boolean;
  EstimatingNotes?: string;
  AutoExpense?: boolean;
  WorkTicketID?: number;
}

export type WorkTicketItemsGetOutput = WorkTicketItemModel[];
