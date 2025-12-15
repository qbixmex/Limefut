export interface PenaltyShootout {
  id?: string;
  localGoals: number;
  visitorGoals: number;
  status: SHOOTOUT_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}