import type { FC } from 'react';
import { MatchesTable } from './matches-table';
import type { PLAYOFF_MATCH } from '../(actions)/fetch-playoff-matches.action';

type Props = Readonly<{
  playoffId: string;
  matches: PLAYOFF_MATCH[];
}>;

export const MatchesWrapper: FC<Props> = async ({ playoffId, matches }) => {
  return (
    <MatchesTable
      playoffId={playoffId}
      matches={matches}
    />
  );
};
