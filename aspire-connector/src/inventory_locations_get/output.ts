export interface InventoryLocation {
  InventoryLocationID?: number;
  BranchID?: number;
  BranchName?: string;
  DefaultLocation?: boolean;
  Active?: boolean;
  AddressID?: number;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  StateProvinceCode?: string;
  ZipCode?: string;
}

export type InventoryLocationsGetOutput = InventoryLocation[];
