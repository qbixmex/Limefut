import { MATCH_STATUS } from "../enums";
import { type Tournament } from "./Tournament";

export interface Match {
  id: string;
  local: string;
  visitor: string;
  place: string;
  matchDate: Date;
  week: number;
  referee: string;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS;
  tournament: Pick<Tournament, 'id' | 'name'>;
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
