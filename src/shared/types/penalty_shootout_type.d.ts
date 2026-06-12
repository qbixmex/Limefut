export type PENALTY_SHOOTOUT_TYPE = {
  id: string;
  localTeam: {
    id: string;
    name: string;
  };
  visitorTeam: {
    id: string;
    name: string;
  };
  localGoals: number;
  visitorGoals: number;
  winnerTeamId: string | null;
  status: string;
  kicks: {
    id: string;
    teamId: string;
    playerId: string | null;
    shooterName: string | null;
    order: number;
    isGoal: boolean | null;
  }[];
};
