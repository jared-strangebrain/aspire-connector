export interface WorkTicketVisitNote {
  WorkTicketVisitNoteID?: number;
  WorkTicketVisitID?: number;
  WorkTicketID?: number;
  Note?: string;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  IsPublic?: boolean;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
  RouteID?: number;
  ScheduledDate?: string;
  StartDateTime?: string;
  EndDateTime?: string;
  RouteName?: string;
  WorkTicketNumber?: number;
}

export type WorkTicketVisitNotesGetOutput = WorkTicketVisitNote[];
