export interface Playoff {
  id: string;
  teamIds: string[];
  startingRound: PLAYOFF_ROUND_TYPE;
  tournamentId: string;
  categoryId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
