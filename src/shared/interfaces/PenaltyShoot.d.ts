export interface PenaltyShoot {
  id?: string;
  shooterNumber: number;
  isGoal: boolean | null;
  shooterName: string;
  createdAt?: Date;
  updatedAt?: Date;
}