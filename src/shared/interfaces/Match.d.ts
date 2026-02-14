import type { MATCH_STATUS_TYPE } from "../enums";
import type { Team } from "./Team";

export interface Match {
  id: string;
  localTeam: Partial<Team>;
  visitorTeam: Partial<Team>;
  place: string | null;
  matchDate: Date | null;
  week: number | null;
  referee: string | null;
  localScore: number;
  visitorScore: number;
  status: MATCH_STATUS_TYPE;
  createdAt?: Date;
  updatedAt?: Date;
}
