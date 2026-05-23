import type { MatchType } from '@/app/admin/encuentros/(actions)/fetch-match.action';

export type Props = Readonly<{
  tournaments: Tournament[];
  categories: Category[];
  teams: Team[];
  week?: number;
  match?: MatchType | null;
  hiddenScores?: boolean;
}>;

export type Team = {
  id: string;
  name: string;
  fields: {
    id: string;
    name: string;
  }[];
};

export type Tournament = {
  id: string;
  name: string;
  permalink: string;
};

export type Category = {
  id: string;
  name: string;
  permalink: string;
};
