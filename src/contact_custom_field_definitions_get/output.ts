export interface TableExtenderHeader {
  ContactCustomFieldDefinitionID?: number;
  ColumnName?: string;
  ColumnType?: string;
  CustomList?: string[];
  DateCreated?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  DisplayOrder?: number;
}

export type ContactCustomFieldDefinitionsGetOutput = TableExtenderHeader[];
