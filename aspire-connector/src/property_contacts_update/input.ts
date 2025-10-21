export type AspireCloudExternalApiPropertyContactsModelsPropertyContactRequest = {
  PropertyID?: number;
  ContactID?: number;
  PrimaryContact?: boolean | null;
  BillingContact?: boolean | null;
  EmailInvoiceContact?: boolean | null;
  EmailNotificationsContact?: boolean | null;
  SMSNotificationsContact?: boolean | null;
};

export type PropertyContactsUpdateInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiPropertyContactsModelsPropertyContactRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
