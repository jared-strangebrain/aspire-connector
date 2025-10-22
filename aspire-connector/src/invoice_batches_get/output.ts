export interface InvoiceBatch {
  InvoiceBatchID?: number;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  InvoiceBatchStatus?: string;
  CreatedDateTime?: string;
  SubmittedByUserID?: number;
  SubmittedByUserName?: string;
  SubmitDateTime?: string;
  InvoiceBatchNumber?: number;
  CustomerEventID?: number;
  CustomerEventTypeID?: number;
  CustomerEventTypeName?: string;
  CustomerEventName?: string;
  CustomerEventStartDateTime?: string;
  CustomerEventEndDateTime?: string;
  CustomerEventDescription?: string;
  AccountingPeriodID?: number;
  AccountingPeriodName?: string;
}

export type InvoiceBatchesGetOutput = InvoiceBatch[];
