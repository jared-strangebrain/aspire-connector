export interface Route {
  RouteID?: number;
  BranchID?: number;
  BranchName?: string;
  RouteName?: string;
  Hours?: number;
  Color?: string;
  CrewLeaderContactID?: number;
  CrewLeaderContactName?: string;
  Active?: boolean;
  ManagerContactID?: number;
  ManagerName?: string;
  RouteSize?: number;
  DivisionID?: number;
  DivisionName?: string;
  DisplayOrder?: number;
  PercentTravelTime?: number;
  ShowDailyPlan?: boolean;
  AllowEquipmentTimeReporting?: boolean;
  EquipmentID?: number;
  EquipmentName?: string;
  RouteProperties?: any[];
  RouteServices?: any[];
  RouteServiceTypes?: any[];
}

export type RoutesGetOutput = Route[];
