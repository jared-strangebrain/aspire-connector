export type AspireCloudExternalApiContactsModelContactUpdateRequest = {
  Contact: any;
  HomeAddress?: any | null;
  OfficeAddress?: any | null;
  HRDetail?: number | null;
  UpdateOpportunities?: boolean;
  ResendEmails?: boolean;
  UpdateInvoicesCompany?: boolean;
  ContactTags?: string | null;
  PayScheduleID?: number;
  UpdateEmailAddress?: boolean;
  UpdatePin?: boolean;
  UpdateTags?: boolean;
};

export type ContactsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiContactsModelContactUpdateRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
