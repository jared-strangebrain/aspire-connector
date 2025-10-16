export interface ContactType {
  ContactTypeID?: number;
  ContactTypeName?: string;
  Active?: boolean;
}

export type ContactTypesGetOutput = ContactType[];
