export interface TaxEntity {
  TaxEntityID?: number;
  TaxEntityName?: string;
  TaxPercent?: number;
  Active?: boolean;
}

export type TaxEntitiesGetOutput = TaxEntity[];
