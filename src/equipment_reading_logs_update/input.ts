export type AspireCloudExternalApiEquipmentReadingLogsModelEquipmentReadingLogUpdateRequest = {
  EquipmentID?: number;
  LogDate: string;
  ReadingDate: string;
  MeterReading: number;
  TroubleCode?: string | null;
  EquipmentReadingLogID?: number;
};

export type EquipmentReadingLogsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiEquipmentReadingLogsModelEquipmentReadingLogUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
