export interface EquipmentSize {
  EquipmentSizeID?: number;
  EquipmentSizeName?: string;
  Active?: boolean;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type EquipmentSizesGetOutput = EquipmentSize[];
