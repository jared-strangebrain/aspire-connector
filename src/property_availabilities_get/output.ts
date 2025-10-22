export interface PropertyAvailability {
  PropertyId?: number;
  DayOfWeek?: number;
  StartTime?: string;
  EndTime?: string;
}

export type PropertyAvailabilitiesGetOutput = PropertyAvailability[];
