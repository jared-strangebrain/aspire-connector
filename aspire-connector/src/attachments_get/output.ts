export interface Attachment {
  AttachmentID?: number;
  AttachmentTypeID?: number;
  AttachmentTypeName?: string;
  PropertyID?: number;
  PropertyName?: string;
  ActivityID?: number;
  ActivityNumber?: number;
  OpportunityID?: number;
  OpportunityNumber?: number;
  ContactID?: number;
  ContactName?: string;
  AttachmentName?: string;
  FileExtension?: string;
  DateUploaded?: string;
  PropertyQACategoryID?: number;
  ShowCustomer?: boolean;
  Note?: string;
  ExposeToCrew?: boolean;
  ReceiptID?: number;
  ReceiptNumber?: number;
  EquipmentID?: number;
  EquipmentDescription?: string;
  OriginalFileName?: string;
  EmployeeIncidentID?: number;
  WorkTicketID?: number;
  WorkTicketNumber?: number;
  AttachToInvoice?: boolean;
  WorkTicketVisitID?: number;
  ExternalContentID?: string;
  NotificationTemplateID?: number;
  GEOLocationLatitude?: number;
  GEOLocationLongitude?: number;
}

export type AttachmentsGetOutput = Attachment[];
