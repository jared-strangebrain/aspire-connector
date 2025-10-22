export interface AttachmentType {
  AttachmentTypeID?: number;
  AttachmentTypeName?: string;
  Required?: boolean;
  Active?: boolean;
  AspireSystemId?: number;
  CanDelete?: boolean;
}

export type AttachmentTypesGetOutput = AttachmentType[];
