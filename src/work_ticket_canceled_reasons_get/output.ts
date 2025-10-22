export interface WorkTicketCanceledReason {
  WorkTicketCanceledReasonId?: number;
  WorkTicketCanceledReasonName?: string;
  Active?: boolean;
  CreatedByUserId?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserId?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type WorkTicketCanceledReasonsGetOutput = WorkTicketCanceledReason[];
