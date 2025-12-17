import type { Tournament } from "./Tournament";
import type { Team } from "./Team";

export interface Standing {
  id: string;
  tournament: Tournament;
  team: Team;
  matchesPlayed: number;
  wings: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
  additionalPoints: number;
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
}
