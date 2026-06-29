import type { FC } from 'react';
import Link from 'next/link';
import { Pagination } from '@/shared/components/pagination';
import { Team } from '../results/team';
import { MatchMetadata } from '../results/match-metadata';
import { Medal, Minus } from 'lucide-react';
import { MATCH_STATUS, type ROUND_TYPE } from '@/shared/enums';
import { fetchPublicPlayoffMatchesAction } from '../../(actions)/home/fetchPublicPlayoffMatchesAction';
import { EditMatch } from '../edit-match';
import { cn } from '@/lib/utils';
import { GiSoccerBall } from 'react-icons/gi';

type Props = Readonly<{
  playoffsPromise: Promise<{ playoffsPage?: string }>;
}>;

export const PlayoffMatches: FC<Props> = async ({ playoffsPromise }) => {
  const playoffsPage = (await playoffsPromise).playoffsPage;

  const { matches, pagination } = await fetchPublicPlayoffMatchesAction({
    take: 4,
    nextMatches: playoffsPage ? Number(playoffsPage) : 1,
  });

  return (
    <section>
      <div className="bg-emerald-700 text-emerald-50 px-5 py-3 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Medal size={50} strokeWidth={1.5} />
            <p className="font-bold text-2xl">Encuentros de Liguilla</p>
          </div>
          <Link href="/liguilla" className="text-emerald-100 hover:text-emerald-300 font-semibold">
            <span className="inline-flex items-center gap-1">
              encuentros de liguilla
              <GiSoccerBall />
            </span>
          </Link>
        </div>
      </div>

      <div className="border border-green-900/90 rounded-b-lg p-5">
        {(matches.length > 0) && (
          matches.map((match, index) => (
            <div key={match.id} className="flex flex-col gap-3 text-gray-800 dark:text-gray-200 relative">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${match.tournament.permalink}` +
                  `&category=${match.category?.id}` +
                  `&local_team=${match.localTeam.permalink}` +
                  `&visitor_team=${match.visitorTeam.permalink}`
                }
              >
                <div className="flex flex-col gap-5 md:flex-row md:gap-5">
                  <div className="w-full lg:w-1/2 order-2 lg:order-1">
                    <MatchMetadata
                      tournamentName={match.tournament.name}
                      category={match.category}
                      place={match.place}
                      date={match.matchDate}
                      status={match.status}
                      round={match.round as ROUND_TYPE}
                      group={match.group}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 grid grid-cols-3 items-center order-1 lg:order-2">
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
                          (
                            match.status === MATCH_STATUS.SCHEDULED ||
                            match.status === MATCH_STATUS.POST_POSED ||
                            match.status === MATCH_STATUS.IN_PROGRESS ||
                            match.status === MATCH_STATUS.CANCELED
                          ) && <Minus strokeWidth={5} width={15} />
                        }

                        {match.status === MATCH_STATUS.COMPLETED && match.localScore}
                      </span>

                      {
                        (
                          match.status === MATCH_STATUS.SCHEDULED ||
                          match.status === MATCH_STATUS.IN_PROGRESS ||
                          match.status === MATCH_STATUS.POST_POSED ||
                          match.status === MATCH_STATUS.CANCELED
                        )
                          ? <div className="w-1 h-5 bg-gray-500 rounded" />
                          : <div className="w-3 h-1 bg-gray-500 rounded" />
                      }

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
                          (
                            match.status === MATCH_STATUS.SCHEDULED ||
                            match.status === MATCH_STATUS.IN_PROGRESS ||
                            match.status === MATCH_STATUS.POST_POSED ||
                            match.status === MATCH_STATUS.CANCELED
                          ) && <Minus strokeWidth={5} width={15} />
                        }

                        {match.status === MATCH_STATUS.COMPLETED && match.visitorScore}
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
              </Link>
              {((matches.length - 1) !== index) && (
                <div className="w-full h-0.5 bg-gray-300 my-3" />
              )}
              <EditMatch
                playoffId={match.playoffId}
                matchId={match.id}
                phase="playoff"
              />
            </div>
          ))
        )}
        {(matches.length === 0) && (
          <div className="text-green-800 dark:text-green-500 text-center font-bold text-xl italic">
            ¡ Aún no hay encuentros de liguilla disponibles !
          </div>
        )}
      </div>

      {
        (pagination.totalPages > 1) && (
          <section className="flex justify-center mt-5">
            <Pagination totalPages={pagination.totalPages} propName="playoffs-results" />
          </section>
        )
      }
    </section >
  );
};
