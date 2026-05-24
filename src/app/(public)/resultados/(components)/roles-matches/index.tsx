import type { FC } from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { EmptyMatches } from '../empty-matches';
import { fetchResultsAction } from '../../(actions)/fetchResultsAction';
import { getUniqueMatches } from '../utils/get-unique-matches';
import { getMatchesSortedByWeeks } from '../utils/get-matches-sorted-by-weeks';
import { MatchesTable } from '../matches-table';

type Props = Readonly<{
  tournamentPermalink: string | undefined;
  categoryPermalink: string | undefined;
  teamPermalink: string | undefined;
  roles: 'complete' | 'team' | 'field' | undefined;
}>;

export const RolesMatches: FC<Props> = async ({
  tournamentPermalink,
  categoryPermalink,
  teamPermalink,
  roles,
}) => {
  if (!tournamentPermalink || !categoryPermalink) return null;

  if (roles !== 'complete' && roles !== 'team') return null;

  if (roles === 'team' && !teamPermalink) return null;

  const { ok, message, matches } = await fetchResultsAction({
    tournamentPermalink: tournamentPermalink as string,
    categoryPermalink: categoryPermalink as string,
    teamPermalink,
    roles,
  });

  if (!ok) {
    redirect(`${ROUTES.PUBLIC_RESULTS}?error=${encodeURIComponent(message)}`);
  }
  const matchesByWeek = getUniqueMatches(matches);
  const matchesSortedWeeks = getMatchesSortedByWeeks(matchesByWeek);
  const unAssignedMatches = matches.filter((match) => match.week === null);

  if (matches.length === 0) {
    return <EmptyMatches />;
  };

  return (
    <>
      {(unAssignedMatches.length > 0) && (
        <section>
          <h2 className="text-xl font-semibold text-blue-500 mb-4">
            Partidos sin jornada asignada
          </h2>
          <MatchesTable matches={unAssignedMatches} />
        </section>
      )}

      <div className="h-0.25 bg-gray-300 dark:bg-gray-600 my-8" />

      {matchesSortedWeeks.map((week) => (
        <div key={week} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Jornada {week}</h3>
          <MatchesTable matches={matchesByWeek[week]} />
        </div>
      ))}
    </>
  );
};
