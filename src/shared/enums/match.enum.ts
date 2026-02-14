export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "inProgress", 
  COMPLETED: "completed",
  POST_POSED: "postPosed",
  CANCELED: "canceled",
} as const;

export type MATCH_STATUS_TYPE = typeof MATCH_STATUS[keyof typeof MATCH_STATUS];
