export interface User {
  UserID?: number;
  AllBranchAccess?: boolean;
  BranchAccess?: any[];
  ExternalContactReference?: string;
  ContactFirstName?: string;
  ContactLastName?: string;
  Active?: boolean;
  UserRoles?: any[];
}

export type UsersGetOutput = User[];
