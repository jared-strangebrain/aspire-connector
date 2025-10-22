export interface DivisionIntegrationCode {
  DivisionIntegrationCodeID?: number;
  DivisionIntegrationCodeName?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
  Active?: boolean;
}

export type DivisionIntegrationCodesGetOutput = DivisionIntegrationCode[];
