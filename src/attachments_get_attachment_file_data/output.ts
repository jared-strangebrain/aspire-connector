export interface AttachmentFileData {
  AttachmentID?: number;
  FileName: string;
  FileData: string;
  ObjectId?: number;
  ObjectCode: string;
  AttachmentTypeID?: number;
  AttachToInvoice?: boolean;
}

export type AttachmentsGetAttachmentFileDataOutput = AttachmentFileData[];
