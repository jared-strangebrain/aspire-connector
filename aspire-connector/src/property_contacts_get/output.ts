export interface PropertyContactDataModel {
  PropertyID?: number;
  ContactID?: number;
  ContactName?: string;
  PrimaryContact?: boolean;
  BillingContact?: boolean;
  EmailInvoiceContact?: boolean;
  EmailNotificationsContact?: boolean;
  CompanyID?: number;
  CompanyName?: string;
  SMSNotificationsContact?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
  PropertyName?: string;
}

export type PropertyContactsGetOutput = PropertyContactDataModel[];
