export type AspireCloudExternalApiContactsModelContactInsertRequest = {
  Contact: any;
  HomeAddress?: any | null;
  OfficeAddress?: any | null;
  ContactTags?: string | null;
  PayScheduleID?: number;
};

export type ContactsCreateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiContactsModelContactInsertRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
