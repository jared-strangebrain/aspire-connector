export interface Role {
  RoleID?: number;
  RoleName?: string;
  Required?: boolean;
  RoleValue?: number;
}

export type RolesGetOutput = Role[];
