export interface Certification {
  CertificationID?: number;
  CertificationTypeID?: number;
  CertificationTypeName?: string;
  ContactID?: number;
  ContactName?: string;
  CertificationDate?: string;
  ExpirationDate?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type CertificationsGetOutput = Certification[];
