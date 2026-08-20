import type { FC } from 'react';
import { fetchPublicLatestMatchesAction } from '../../(actions)/home/fetchPublicLatestMatchesAction';
import { Pagination } from '@/shared/components/pagination';
import { GameScore, SoccerPlayer } from '@/shared/components/icons';
import Link from 'next/link';
import { Team } from '../results/team';
import { MatchMetadata } from '../results/match-metadata';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';
import { MATCH_STATUS } from '@/shared/enums';
import { EditMatch } from '../edit-match';
import styles from './styles.module.css';

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
      <div className={styles.head}>
        <GameScore size={50} strokeWidth={1.5} />
        <p> Resultados Recientes <span>(temporada regular)</span></p>
      </div>

      <div className={styles.content}>
        {(matches.length > 0) && matches.map((match, index) => (
          <div key={match.id} className="relative">
            <Link
              href={`/resultados/${match.id}/`}
              data-testid={`match-${match.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <div className={styles.results}>
                <div className={styles.resultsWrapper}>
                  <div className={styles.metadata}>
                    <MatchMetadata
                      tournamentName={match.tournament.name}
                      category={match.category}
                      week={match.week}
                      field={match.field}
                      date={match.matchDate}
                      status={match.status}
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
                        className={cn('font-bold text-2xl', {
                          [styles.matchPending]: match.status !== MATCH_STATUS.COMPLETED,
                          [styles.matchCompleted]: match.status === MATCH_STATUS.COMPLETED,
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
                        className={cn(styles.matchGoals, {
                          [styles.matchPending]: match.status !== MATCH_STATUS.COMPLETED,
                          [styles.matchCompleted]: match.status === MATCH_STATUS.COMPLETED,
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
                {((matches.length - 1) !== index) && (
                  <div className="w-full h-0.5 bg-gray-500/40 mb-5" />
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
          <div className={styles.noMatchesContent}>
            <SoccerPlayer
              size={150}
              strokeWidth={3}
              className={styles.soccerPlayerIcon}
            />

            <p className={styles.message}>
              Por el momento no hay encuentros programados
            </p>
          </div>
        )}
      </div>
      {
        (pagination.totalPages > 1) && (
          <section className={styles.pagination}>
            <Pagination totalPages={pagination.totalPages} propName="latest-results" />
          </section>
        )
      }
    </section>
  );
};

export default LatestResults;
