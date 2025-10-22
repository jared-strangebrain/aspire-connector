export interface ActivityCommentHistory {
  ActivityCommentHistoryID?: number;
  ContactID?: number;
  ActivityID?: number;
  ContactName?: string;
  Comment?: string;
  CreatedDateTime?: string;
  Attachment?: boolean;
  PublicComment?: boolean;
}

export type ActivityCommentHistoriesGetOutput = ActivityCommentHistory[];
