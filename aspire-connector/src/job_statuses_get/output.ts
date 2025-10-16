export interface JobStatusModel {
  JobStatusID?: number;
  JobStatus?: string;
  JobStatusName?: string;
  SortOrder?: number;
}

export type JobStatusesGetOutput = JobStatusModel[];
