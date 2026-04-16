import type { MATCH_STATUS_TYPE } from '../enums';

export type TeamForMatch = {
  id: string;
  name: string;
  fields: {
    id: string;
    name: string;
  }[];
};

export interface Match {
  id: string;
  localTeam: TeamForMatch;
  visitorTeam: TeamForMatch;
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
