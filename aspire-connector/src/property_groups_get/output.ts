export interface PropertyGroup {
  PropertyGroupID?: number;
  PropertyGroupName?: string;
  Active?: boolean;
}

export type PropertyGroupsGetOutput = PropertyGroup[];
