export interface County {
  LocalityID?: number;
  LocalityName?: string;
  LocalCode?: string;
  Active?: boolean;
}

export type LocalitiesGetOutput = County[];
