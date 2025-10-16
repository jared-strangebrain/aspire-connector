export interface WorkersComp {
  WorkersCompID?: number;
  WorkersCompName?: string;
  WorkersCompCode?: string;
  CreatedDateTime?: string;
  CreatedByUserName?: string;
  ModifiedDateTime?: string;
  ModifiedByUserName?: string;
  CreatedByUserID?: number;
  ModifiedByUserID?: number;
}

export type WorkersCompsGetOutput = WorkersComp[];
