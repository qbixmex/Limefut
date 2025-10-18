import { MATCH_STATUS } from "../enums";

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
  status: MATCH_STATUS;
}
