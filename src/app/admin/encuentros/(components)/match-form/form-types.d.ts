import type { MatchType } from '@/app/admin/encuentros/(actions)/fetch-match.action';

export type Props = Readonly<{
  authenticatedUserId: string | undefined;
  sessionUserRoles: string[];
  tournaments: Tournament[];
  categories: Category[];
  teams: Team[];
  week?: number;
  match?: MatchType | null;
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
