export type AspireCloudExternalApiPaySchedulesModelRequestPayScheduleInsert = {
  PayScheduleName: string;
  DailyHoursBeforeOT: number;
  WeeklyHoursBeforeOT: number;
  Active: boolean;
  DefaultOTPayCodeID: number;
  DefaultPayCodeID: number;
};

export type PaySchedulesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPaySchedulesModelRequestPayScheduleInsert;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
