import { redirect } from 'next/navigation';
import { fetchPublicPlayoffsAction } from '../(actions)/fetch-public-playoffs.action';
import { BracketRound } from './bracket-round';
import type { PLAYOFF_ROUND_TYPE } from '@/shared/enums';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const BracketContent = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const tournamentPermalink = params.tournament;
  const categoryPermalink = params.category;

  if (!tournamentPermalink || !categoryPermalink) return null;

  const { ok, message, brackets } = await fetchPublicPlayoffsAction({
    tournamentPermalink,
    categoryPermalink,
  });

  if (!ok) {
    redirect(`/liguilla?error=${encodeURIComponent(message)}`);
  }

  if (brackets.length === 0) return null;

  return (
    <>
      {brackets.map((group) => (
        <BracketRound
          key={group.groupName}
          groupName={group.groupName}
          variant={group.variant}
          startingRound={group.startingRound as PLAYOFF_ROUND_TYPE}
          quarterFinals={group.quarterFinals}
          semiFinals={group.semiFinals}
          final={group.final}
        />
      ))}
    </>
  );
};
