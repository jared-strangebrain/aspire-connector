export interface PaySchedule {
  PayScheduleID?: number;
  PayScheduleName?: string;
  DailyHoursBeforeOT?: number;
  WeeklyHoursBeforeOT?: number;
  Active?: boolean;
  DefaultPayCodeID?: number;
  DefaultPayCodeName?: string;
  DefaultOTPayCodeID?: number;
  DefaultOTPayCodeName?: string;
}

export type PaySchedulesGetOutput = PaySchedule[];
