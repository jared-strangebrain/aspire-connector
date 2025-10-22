export interface Service {
  ServiceID?: number;
  ServiceTypeID?: number;
  ServiceTypeName?: string;
  ServiceName?: string;
  ServiceNameAbr?: string;
  DisplayName?: string;
  ServiceDescription?: string;
  LaborTaxable?: boolean;
  MaterialTaxable?: boolean;
  EquipmentTaxable?: boolean;
  SubTaxable?: boolean;
  OtherTaxable?: boolean;
  Active?: boolean;
  ApproveTicketOnCompletion?: boolean;
  MinimumPrice?: number;
  DefaultPayCodeID?: number;
  DefaultPayCodeName?: string;
  WorkersCompID?: number;
  WorkersCompName?: string;
  FormID?: number;
  StartFormID?: number;
  FormName?: string;
  ContractService?: boolean;
  SortOrder?: number;
  MultiVisit?: boolean;
  ServiceTaxOverrides?: any[];
  ServiceBranches?: any[];
  AllBranches?: boolean;
}

export type ServicesGetOutput = Service[];
