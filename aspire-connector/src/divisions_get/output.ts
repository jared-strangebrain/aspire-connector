export interface Division {
  DivisionID?: number;
  DivisionName?: string;
  Active?: boolean;
  DivisionCode?: string;
  Indirect?: boolean;
  WorkersCompID?: number;
  WorkersCompName?: string;
  AccountNumber?: string;
  MaterialExpenseAccountNumber?: string;
  EquipmentExpenseAccountNumber?: string;
  SubExpenseAccountNumber?: string;
  OtherExpenseAccountNumber?: string;
}

export type DivisionsGetOutput = Division[];
