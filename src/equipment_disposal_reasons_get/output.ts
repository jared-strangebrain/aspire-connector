export interface EquipmentDisposalReason {
  EquipmentDisposalReasonID?: number;
  DisposalReason?: string;
  Active?: boolean;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  CreatedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  LastModifiedDateTime?: string;
}

export type EquipmentDisposalReasonsGetOutput = EquipmentDisposalReason[];
