import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { MatchesTable } from './matches-table';
import { fetchPlayoffMatchesAction } from '../(actions)/fetch-playoff-matches.action';

type Props = Readonly<{
  tournamentPermalink: string;
  categoryPermalink: string;
  currentPage: number;
  query: string;
  sortMatchDate: 'asc' | 'desc';
  status: MATCH_STATUS_TYPE;
}>;

export const MatchesWrapper: FC<Props> = async ({
  tournamentPermalink,
  categoryPermalink,
  currentPage,
  query,
  sortMatchDate,
  status,
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const response = await fetchPlayoffMatchesAction({
    tournamentPermalink,
    categoryPermalink,
    page: currentPage,
    take: 12,
    searchTerm: query,
    sortMatchDate,
    status,
  });

  return (
    <MatchesTable
      matches={response.matches}
      pagination={response.pagination}
      roles={session?.user.roles as string[]}
    />
  );
};

//   {
//     "id": "35d5a0d8-6592-4db9-8405-f8d7b2085287",
//     "round": "semifinal",
//     "group": "gold",
//     "position": 1,
//     "local": {
//       "id": "df9c7845-90fc-443e-8e69-5022e2edf939",
//       "name": "CID Base Aerea",
//     },
//     "localScore": 0,
//     "visitor": {
//       "id": "bc2439b9-43b5-44bd-934c-7b0d982ceabb",
//       "name": "Premiere FC",
//     },
//     "visitorScore": 0,
//     "status": "scheduled",
//     "matchDate": "2026-06-03T10:40:00.000Z",
//     "field": {
//       "id": "bdf2acce-0fb6-4dbb-9d73-f32a7c2a4d7c",
//       "name": "Unidad Deportiva Base Aerea",
//     },
//     "penaltyShootout": null
//   },
// ]
