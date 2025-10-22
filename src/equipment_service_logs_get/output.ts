export interface EquipmentServiceLog {
  EquipmentServiceLogID?: number;
  EquipmentID?: number;
  EquipmentModelServiceScheduleID?: number;
  BranchID?: number;
  BranchName?: string;
  DivisionID?: number;
  DivisionName?: string;
  RouteID?: number;
  RouteName?: string;
  ServiceDate?: string;
  TechnicianContactID?: number;
  TechnicianContactName?: string;
  ServiceComment?: string;
  ServiceCost?: number;
  ServiceHours?: number;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  MeterReading?: number;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type EquipmentServiceLogsGetOutput = EquipmentServiceLog[];
