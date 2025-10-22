export type CreateAsNeededWorkTicketRequest = {
  OpportunityServiceId?: number;
  RouteId?: number;
  ScheduledStartDate: string;
  StartDateTime?: string;
  EndDateTime?: string;
  HoursPerDay?: number;
};

export type WorkTicketsCreateAsNeededWorkTicketsInput = {
  /**
   * Request body
   */
  body: CreateAsNeededWorkTicketRequest;
  // Original parameter name: api-version
  api_version?: string;
};
