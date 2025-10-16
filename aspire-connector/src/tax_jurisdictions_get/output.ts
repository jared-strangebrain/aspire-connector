export interface TaxJurisdiction {
  TaxJurisdictionID?: number;
  TaxJurisdictionName?: string;
  StateTaxPercent?: number;
  FederalTaxPercent?: number;
  Active?: boolean;
  TaxEntityJurisdictions?: any[];
}

export type TaxJurisdictionsGetOutput = TaxJurisdiction[];
