import type { MATCH_STATUS } from "../enums";
import type { Tournament } from "./Tournament";
import type { Team } from "./Team";

export interface Match {
  id: string;
  localTeam: Partial<Team>;
  visitorTeam: Partial<Team>;
  place: string;
  matchDate: Date;
  week: number;
  referee: string;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MatchSeed {
  local: string;
  visitor: string;
  place: string;
  matchDate: Date;
  week: number;
  referee: string;
  localScore: number;
  visitorScore: number;
  tournament: Pick<Tournament, 'id' | 'name'>;
  status: MATCH_STATUS;
}
