export interface ServiceTypeIntegrationCode {
  ServiceTypeIntegrationCodeID?: number;
  ServiceTypeIntegrationCodeName?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
  Active?: boolean;
}

export type ServiceTypeIntegrationCodesGetOutput = ServiceTypeIntegrationCode[];
