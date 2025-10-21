export type AspireCloudExternalApiEquipmentReadingLogsModelEquipmentReadingLogInsertRequest = {
  EquipmentID?: number;
  LogDate: string;
  ReadingDate: string;
  MeterReading: number;
  TroubleCode?: string | null;
};

export type EquipmentReadingLogsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiEquipmentReadingLogsModelEquipmentReadingLogInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
