export interface CertificationType {
  CertificationTypeID?: number;
  CertificationTypeName?: string;
  Active?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type CertificationTypesGetOutput = CertificationType[];
