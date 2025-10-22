export interface EmployeeIncident {
  EmployeeIncidentID?: number;
  EmployeeIncidentTypeID?: number;
  EmployeeIncidentTypeName?: string;
  ContactID?: number;
  ContactName?: string;
  EmployeeIncidentDate?: string;
  Cost?: number;
  InsuranceSubmissionDate?: string;
  HRComments?: string;
  EmployeeComments?: string;
  SupervisorComments?: string;
  CreatedByUserID?: number;
  CreatedDateTime?: string;
  CreatedByUserName?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
  SupervisorContactID?: number;
  HRContactID?: number;
}

export type EmployeeIncidentsGetOutput = EmployeeIncident[];
