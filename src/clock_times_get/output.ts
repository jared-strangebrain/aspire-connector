export interface ClockTime {
  ClockTimeID?: number;
  ContactID?: number;
  ContactName?: string;
  ClockStart?: string;
  ClockEnd?: string;
  AcceptedDateTime?: string;
  AcceptedUserID?: number;
  AcceptedUserName?: string;
  BreakTime?: number;
  AcceptedShortLunch?: boolean;
  UsedBreaks?: boolean;
  PreventedFromUsingBreaks?: boolean;
  GEOLocationStartLatitude?: number;
  GEOLocationStartLongitude?: number;
  GEOLocationEndLatitude?: number;
  GEOLocationEndLongitude?: number;
}

export type ClockTimesGetOutput = ClockTime[];
