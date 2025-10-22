export interface ActivityCategory {
  ActivityCategoryID?: number;
  ActivityType?: string;
  ActivityCategoryName?: string;
  Active?: boolean;
}

export type ActivityCategoriesGetOutput = ActivityCategory[];
