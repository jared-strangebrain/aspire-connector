export interface ActivityContact {
  ContactID?: number;
  ContactName?: string;
  ActivityContactID?: number;
  EmailAddress?: string;
  AssignmentType?: string;
  IgnoreNullContact?: boolean;
}

export type ActivityContactsGetOutput = ActivityContact[];
