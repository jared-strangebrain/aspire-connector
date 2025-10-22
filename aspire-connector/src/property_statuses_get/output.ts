export interface PropertyStatus {
  PropertyStatusID?: number;
  PropertyStatusName?: string;
  Active?: boolean;
}

export type PropertyStatusesGetOutput = PropertyStatus[];
