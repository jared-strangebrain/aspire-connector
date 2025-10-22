export type AspireCloudExternalApiPaySchedulesModelRequestPayScheduleUpdate = {
  PayScheduleName: string;
  DailyHoursBeforeOT: number;
  WeeklyHoursBeforeOT: number;
  Active: boolean;
  DefaultOTPayCodeID: number;
  DefaultPayCodeID: number;
  PayScheduleID?: number;
};

export type PaySchedulesUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPaySchedulesModelRequestPayScheduleUpdate;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
