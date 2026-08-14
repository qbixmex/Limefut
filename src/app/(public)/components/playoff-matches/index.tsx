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
import styles from './styles.module.css';
import { SoccerPlayer } from '@/shared/components/icons';

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
      <div className={styles.head}>
        <div className="w-full flex items-center justify-between">
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

      <div className={styles.content}>
        {(matches.length > 0) && (
          matches.map((match, index) => (
            <div key={match.id} className="relative">
              <Link
                href={
                  '/liguilla/encuentro' +
                  `?tournament=${match.tournament.permalink}` +
                  `&category=${match.category?.id}` +
                  `&local_team=${match.localTeam.permalink}` +
                  `&visitor_team=${match.visitorTeam.permalink}`
                }
              >
                <div className={styles.results}>
                  <div className={styles.resultsWrapper}>
                    <div className={styles.metadata}>
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
                    <div className={styles.match}>
                      <Team
                        imageUrl={match.localTeam.imageUrl}
                        name={match.localTeam.name}
                      />
                      <div className={styles.penaltyShoots}>
                        {match.penaltyShoots && (
                          <span className={styles.shoot}>
                            ({match.penaltyShoots.localGoals})
                          </span>
                        )}
                        <span
                          className={cn(styles.matchGoals, {
                            [styles.matchPending]: match.status !== MATCH_STATUS.COMPLETED,
                            [styles.matchCompleted]: match.status === MATCH_STATUS.COMPLETED,
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
                          className={cn(styles.matchGoals, {
                            [styles.matchPending]: match.status !== MATCH_STATUS.COMPLETED,
                            [styles.matchCompleted]: match.status === MATCH_STATUS.COMPLETED,
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
                          <span className={styles.shoot}>
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
                </div>
              </Link>
              {((matches.length - 1) !== index) && (
                <div className="w-full h-0.5 bg-gray-500/40 my-5" />
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
          <div className={styles.noMatchesContent}>
            <SoccerPlayer
              size={150}
              strokeWidth={3}
              className={styles.soccerPlayerIcon}
            />

            <p className={styles.message}>
              Por el momento no hay encuentros de liguilla programados
            </p>
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
    </section>
  );
};
