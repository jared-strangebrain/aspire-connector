export interface Address {
  AddressID?: number;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  StateProvinceCode?: string;
  ZipCode?: string;
  CreatedByUserId?: number;
  CreatedByUserName?: string;
  CreatedOn?: string;
  LastModifiedByUserId?: number;
  LastModifiedByUserName?: string;
  LastModifiedOn?: string;
}

export type AddressesGetOutput = Address[];
