export interface EquipmentServiceTag {
  EquipmentServiceTagID?: number;
  ServiceTagName?: string;
  ServiceTagCost?: number;
  ServiceTagHours?: number;
  Active?: boolean;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  ServiceType?: string;
}

export type EquipmentServiceTagsGetOutput = EquipmentServiceTag[];
