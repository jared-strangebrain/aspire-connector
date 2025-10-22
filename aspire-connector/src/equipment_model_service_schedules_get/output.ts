export interface EquipmentModelServiceSchedule {
  EquipmentModelServiceScheduleID?: number;
  EquipmentModelID?: number;
  ModelName?: string;
  ServiceScheduleType?: string;
  ServiceScheduleCalendarType?: string;
  ServiceScheduleValue?: number;
  EquipmentServiceTagID?: number;
  ServiceTagName?: string;
  ServiceScheduleCost?: number;
  ServiceScheduleHours?: number;
  Active?: boolean;
  Reoccurring?: boolean;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
}

export type EquipmentModelServiceSchedulesGetOutput = EquipmentModelServiceSchedule[];
