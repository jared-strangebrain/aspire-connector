export interface EquipmentReadingLog {
  EquipmentReadingLogID?: number;
  EquipmentID?: number;
  BranchID?: number;
  BranchName?: string;
  DivisionID?: number;
  DivisionName?: string;
  RouteID?: number;
  RouteName?: string;
  LogDate?: string;
  ReadingDate?: string;
  MeterReading?: number;
  TroubleCode?: string;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type EquipmentReadingLogsGetOutput = EquipmentReadingLog[];
