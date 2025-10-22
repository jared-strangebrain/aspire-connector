export interface PropertyType {
  PropertyTypeID?: number;
  PropertyTypeName?: string;
  IntegrationCodeName?: string;
  Active?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
}

export type PropertyTypesGetOutput = PropertyType[];
