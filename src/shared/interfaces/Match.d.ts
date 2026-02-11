import type { MATCH_STATUS } from "../enums";
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
  status: MATCH_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
