export interface TakeoffGroup {
  TakeoffGroupID?: number;
  TakeoffGroupName?: string;
  SortOrder?: number;
  Active?: boolean;
}

export type TakeoffGroupsGetOutput = TakeoffGroup[];
