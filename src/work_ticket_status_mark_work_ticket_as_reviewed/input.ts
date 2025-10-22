export type MarkWorkTicketAsReviewedRequest = {
  WorkTicketID?: number;
  ReviewedDateTime: string;
  ReviewedUserID?: number;
};

export type WorkTicketStatusMarkWorkTicketAsReviewedInput = {
  /**
   * Request body
   */
  body: MarkWorkTicketAsReviewedRequest;
  // Original parameter name: api-version
  api_version?: string;
};
