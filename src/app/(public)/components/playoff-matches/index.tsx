import type { FC } from 'react';
import { Pagination } from '@/shared/components/pagination';
import { Team } from '../results/team';
import { MatchMetadata } from '../results/match-metadata';
import { Medal } from 'lucide-react';
import type { ROUND_TYPE } from '@/shared/enums';
import { fetchPublicPlayoffMatchesAction } from '../../(actions)/home/fetchPublicPlayoffMatchesAction';

type Props = Readonly<{
  playoffsPromise: Promise<{ playoffsPage?: string }>;
}>;

export const PlayoffMatches: FC<Props> = async ({ playoffsPromise }) => {
  const latestResultsPage = (await playoffsPromise).playoffsPage;

  const { matches, pagination } = await fetchPublicPlayoffMatchesAction({
    take: 4,
    nextMatches: latestResultsPage ? Number(latestResultsPage) : 1,
  });

  return (
    <section>
      <div className="bg-emerald-700 text-emerald-50 px-5 py-3 rounded-t-lg flex items-center gap-3">
        <Medal size={50} strokeWidth={1.5} />
        <p className="font-bold text-2xl">Encuentros de Liguilla</p>
      </div>

      <div className="border border-green-900/90 rounded-b-lg p-5">
        {(matches.length > 0) && (
          matches.map((match, index) => (
            <div key={match.id} className="flex flex-col gap-3 text-gray-800 dark:text-gray-200">
              <div className="flex flex-col gap-5 md:flex-row md:gap-5">
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                  <MatchMetadata
                    tournamentName={match.tournament.name}
                    category={match.tournament.category}
                    format={match.tournament.format}
                    place={match.place}
                    date={match.matchDate}
                    status={match.status}
                    round={match.round as ROUND_TYPE}
                    group={match.group}
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
                      className="font-bold text-2xl text-blue-700 dark:text-blue-500"
                      role="heading"
                      aria-level={3}
                      aria-label={`Goles del equipo local ${match.localTeam.name}`}
                    >
                      {match.localScore}
                    </span>
                    <span>-</span>
                    <span
                      className="font-bold text-2xl text-blue-700 dark:text-blue-500"
                      aria-label={`Goles del equipo visitante ${match.visitorTeam.name}`}
                    >
                      {match.visitorScore}
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
          ))
        )}
        {(matches.length === 0) && (
          <div className="text-green-800 dark:text-green-500 text-center font-bold text-xl italic">
            ¡ Aún no hay encuentros de liguilla disponibles !
          </div>
        )}
      </div>

      {(pagination.totalPages > 1) && (
        <section className="flex justify-center mt-5">
          <Pagination totalPages={pagination.totalPages} propName="latest-results" />
        </section>
      )}
    </section>
  );
};
