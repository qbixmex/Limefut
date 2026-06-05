export interface PlayoffMatch {
  id?: string;
  round: PlayoffRound;
  group: string;
  position: number;
  localScore: number | null;
  visitorScore: number | null;
  status: Status;
  matchDate: Date | null;
  referee: string | null;
  remarks: string | null;
  playoffId: string;
  localId: string;
  visitorId: string;
  winnerId: string | null;
  fieldId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
