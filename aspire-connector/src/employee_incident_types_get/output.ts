export interface EmployeeIncidentType {
  EmployeeIncidentTypeID?: number;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
  EmployeeIncidentTypeName?: string;
  Active?: boolean;
}

export type EmployeeIncidentTypesGetOutput = EmployeeIncidentType[];
