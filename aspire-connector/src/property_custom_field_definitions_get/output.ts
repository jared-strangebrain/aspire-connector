export interface TableExtenderHeader {
  PropertyCustomFieldDefinitionID?: number;
  ColumnName?: string;
  ColumnType?: string;
  CustomList?: string[];
  DateCreated?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  DisplayOrder?: number;
}

export type PropertyCustomFieldDefinitionsGetOutput = TableExtenderHeader[];
