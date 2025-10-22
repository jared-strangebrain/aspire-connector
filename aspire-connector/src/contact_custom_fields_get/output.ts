export interface TableExtenderDetail {
  ContactCustomFieldValueID?: number;
  ContactCustomFieldDefinitionID?: number;
  ContactID?: number;
  ColumnValue?: string;
}

export type ContactCustomFieldsGetOutput = TableExtenderDetail[];
