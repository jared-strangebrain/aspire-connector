export type AspireCloudExternalApiClockTimesModelClockTimeInsertRequest = {
  ContactID?: number;
  ClockStartLat?: number;
  ClockStartLong?: number;
  ClockStartDateTime: string;
  BreakTime?: number;
  RouteID?: number | null;
  CrewLeaderContactID?: number | null;
  ClockEndLat?: number;
  ClockEndLong?: number;
  ClockEndDateTime: string;
};

export type ClockTimesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiClockTimesModelClockTimeInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
