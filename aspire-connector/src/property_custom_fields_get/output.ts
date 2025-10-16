export interface TableExtenderDetail {
  PropertyCustomFieldValueID?: number;
  PropertyCustomFieldDefinitionID?: number;
  PropertyID?: number;
  ColumnValue?: string;
}

export type PropertyCustomFieldsGetOutput = TableExtenderDetail[];
