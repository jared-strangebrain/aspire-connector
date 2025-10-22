export interface SalesType {
  SalesTypeID?: number;
  SalesTypeName?: string;
  Active?: boolean;
}

export type SalesTypesGetOutput = SalesType[];
