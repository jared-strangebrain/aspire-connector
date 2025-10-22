export interface EquipmentRequestedService {
  EquipmentRequestedServiceID?: number;
  EquipmentServiceTagID?: number;
  ServiceTagName?: string;
  EquipmentID?: number;
  EquipmentServiceLogID?: number;
  Notes?: string;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  EquipmentInspectionCategoryID?: number;
  EquipmentInspectionCategoryName?: string;
  EquipmentInspectionID?: number;
  RequestSource?: string;
}

export type EquipmentRequestedServicesGetOutput = EquipmentRequestedService[];
