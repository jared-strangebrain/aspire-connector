export type AspireCloudExternalApiWorkTicketTimesModelWorkTicketTimeInsertRequest = {
  ContactID?: number;
  WorkTicketID?: number;
  StartTime: string;
  StartLatitude?: number | null;
  StartLongitude?: number | null;
  RouteID?: number | null;
  CrewLeaderContactID?: number | null;
  EndTime: string;
  EndLatitude?: number | null;
  EndLongitude?: number | null;
};

export type WorkTicketTimesCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiWorkTicketTimesModelWorkTicketTimeInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
