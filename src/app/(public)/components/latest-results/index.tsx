import type { FC } from 'react';
import { fetchPublicLatestMatchesAction } from '../../(actions)/home/fetchPublicLatestMatchesAction';
import { Pagination } from '@/shared/components/pagination';
import { GameScore } from '@/shared/components/icons';
import Link from 'next/link';
import { Team } from '../results/team';
import { MatchMetadata } from '../results/match-metadata';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';
import { MATCH_STATUS } from '@/shared/enums';
import { EditMatch } from '../edit-match';

type Props = Readonly<{
  resultsPromise: Promise<{ latestResultsPage?: string }>;
}>;

export const LatestResults: FC<Props> = async ({ resultsPromise }) => {
  const latestResultsPage = (await resultsPromise).latestResultsPage;

  const { matches, pagination } = await fetchPublicLatestMatchesAction({
    take: 4,
    nextMatches: latestResultsPage ? Number(latestResultsPage) : 1,
  });

  return (
    <section>
      <div className="bg-emerald-700 text-emerald-50 px-5 py-3 rounded-t-lg flex items-center gap-3">
        <GameScore size={50} strokeWidth={1.5} />
        <p className="font-bold text-2xl">
          Resultados Recientes{' '}
          <span className="text-xs text-gray-300">(temporada regular)</span>
        </p>
      </div>

      <div className="border border-green-900/90 rounded-b-lg p-5">
        {(matches.length > 0) && matches.map((match, index) => (
          <div key={match.id} className="relative">
            <Link
              href={`/resultados/${match.id}/`}
              data-testid={`match-${match.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex flex-col gap-3 text-gray-800 dark:text-gray-200">
                <div className="flex flex-col gap-5 md:flex-row md:gap-5">
                  <div className="w-full lg:w-1/2 order-2 lg:order-1">
                    <MatchMetadata
                      tournamentName={match.tournament.name}
                      category={match.category}
                      week={match.week}
                      place={match.place}
                      date={match.matchDate}
                      status={match.status}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 grid grid-cols-3 order-1 lg:order-2">
                    <Team
                      imageUrl={match.localTeam.imageUrl}
                      name={match.localTeam.name}
                    />
                    <div className="flex justify-center items-center gap-2">
                      {match.penaltyShoots && (
                        <span className="font-semibold text-gray-500">
                          ({match.penaltyShoots.localGoals})
                        </span>
                      )}
                      <span
                        className={cn('font-bold text-2xl', {
                          'text-gray-700 dark:text-gray-500': match.status !== MATCH_STATUS.COMPLETED,
                          'text-blue-700 dark:text-blue-500': match.status === MATCH_STATUS.COMPLETED,
                        })}
                        role="heading"
                        aria-level={3}
                        aria-label={`Goles del equipo local ${match.localTeam.name}`}
                      >
                        {
                          (match.status === MATCH_STATUS.COMPLETED)
                            ? match.localScore
                            : <Minus strokeWidth={5} width={15} />
                        }
                      </span>
                      {
                        match.status === MATCH_STATUS.COMPLETED
                          ? <div className="w-3 h-1 bg-gray-500 rounded" />
                          : <div className="w-1 h-5 bg-gray-500 rounded" />
                      }
                      <span
                        className={cn('font-bold text-2xl', {
                          'text-gray-700 dark:text-gray-500': match.status !== MATCH_STATUS.COMPLETED,
                          'text-blue-700 dark:text-blue-500': match.status === MATCH_STATUS.COMPLETED,
                        })}
                        aria-label={`Goles del equipo visitante ${match.visitorTeam.name}`}
                      >
                        {
                          (match.status === MATCH_STATUS.COMPLETED)
                            ? match.visitorScore
                            : <Minus strokeWidth={5} width={15} />
                        }
                      </span>
                      {match.penaltyShoots && (
                        <span className="font-semibold text-gray-500">
                          ({match.penaltyShoots.visitorGoals})
                        </span>
                      )}
                    </div>
                    <Team
                      imageUrl={match.visitorTeam.imageUrl}
                      name={match.visitorTeam.name}
                    />
                  </div>
                </div>
                {((matches.length - 1) !== index) && (
                  <div className="w-full h-0.5 bg-gray-300 my-3" />
                )}
              </div>
            </Link>
            <EditMatch
              matchId={match.id}
              phase="regular"
            />
          </div>
        ))}

        {(matches.length === 0) && (
          <div className="text-green-800 dark:text-green-500 text-center font-bold text-xl italic">
            ¡ No hay encuentros recientes !
          </div>
        )}
      </div>
      {
        (pagination.totalPages > 1) && (
          <section className="flex justify-center mt-5">
            <Pagination totalPages={pagination.totalPages} propName="latest-results" />
          </section>
        )
      }
    </section>
  );
};

export default LatestResults;
