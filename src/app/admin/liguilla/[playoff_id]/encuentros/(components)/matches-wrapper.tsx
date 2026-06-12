import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { MatchesTable } from './matches-table';
import type { PLAYOFF_MATCH } from '../(actions)/fetch-playoff-matches.action';

type Props = Readonly<{
  playoffId: string;
  matches: PLAYOFF_MATCH[];
}>;

export const MatchesWrapper: FC<Props> = async ({ playoffId, matches }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <MatchesTable
      playoffId={playoffId}
      matches={matches}
      authenticatedUserRoles={session?.user.roles}
    />
  );
};
