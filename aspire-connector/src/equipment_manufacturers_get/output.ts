export interface EquipmentManufacturer {
  EquipmentManufacturerID?: number;
  EquipmentManufacturerName?: string;
  Active?: boolean;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
}

export type EquipmentManufacturersGetOutput = EquipmentManufacturer[];
