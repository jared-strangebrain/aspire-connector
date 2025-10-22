export interface ServiceType {
  ServiceTypeID?: number;
  DivisionID?: number;
  DivisionName?: string;
  ServiceTypeName?: string;
  SortOrder?: number;
  Active?: boolean;
}

export type ServiceTypesGetOutput = ServiceType[];
