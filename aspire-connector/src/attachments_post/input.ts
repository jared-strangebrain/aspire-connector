export type AspireCloudExternalApiAttachmentsModelsAttachmentUploadRequest = {
  FileName: string;
  FileData: string;
  ObjectId?: number;
  ObjectCode: string;
  AttachmentTypeId: number;
  AttachToInvoice?: boolean | null;
  ExposeToCrew?: boolean | null;
};

export type AttachmentsPostInput = {
  /**
   * Request body
   */
  body: AspireCloudExternalApiAttachmentsModelsAttachmentUploadRequest;
  /**
   * Original parameter name: api-version
   */
  api_version?: string;
};
