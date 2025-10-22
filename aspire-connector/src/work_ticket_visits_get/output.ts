export interface WorkTicketVisit {
  WorkTicketVisitID?: number;
  RouteID?: number;
  ScheduledDate?: string;
  SequenceNum?: number;
  WorkTicketID?: number;
  Hours?: number;
  RouteName?: string;
  WorkTicketNumber?: number;
}

export type WorkTicketVisitsGetOutput = WorkTicketVisit[];
