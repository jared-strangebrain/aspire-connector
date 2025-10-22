export interface EquipmentClass {
  EquipmentClassID?: number;
  EquipmentClassName?: string;
  Active?: boolean;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
}

export type EquipmentClassesGetOutput = EquipmentClass[];
