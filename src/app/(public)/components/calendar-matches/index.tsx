import type { FC } from 'react';
import Link from 'next/link';
import { Pagination } from '@/shared/components/pagination';
import { Team } from '../results/team';
import { MatchMetadata } from '../results/match-metadata';
import { SoccerField, SoccerPlayer } from '@/shared/components/icons';
import { HorizontalCalendar } from '../horizontal-calendar';
import { fetchPublicMatchesAction } from '../../(actions)/home/fetchPublicMatchesAction';
import { fetchPublicMatchesCountAction } from '../../(actions)/home/fetchPublicMatchesCountAction';
import { MATCH_STATUS } from '@/shared/enums';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';
import { EditMatch } from '../edit-match';
import styles from './styles.module.css';

type Props = Readonly<{
  matchesPromise: Promise<{ matchesPage: string | undefined }>;
  selectedDayPromise: Promise<{ selectedDay: string | undefined }>;
}>;

const timeZone = 'America/Mexico_City';

export const CalendarMatches: FC<Props> = async ({ matchesPromise, selectedDayPromise }) => {
  const { matchesPage } = await matchesPromise;
  const { selectedDay } = await selectedDayPromise;
  const { matches, pagination } = await fetchPublicMatchesAction({
    take: 4,
    nextMatches: Number(matchesPage) ?? undefined,
    selectedDay: selectedDay ?? undefined,
    timeZone,
  });
  const { matchesDates } = await fetchPublicMatchesCountAction({ timeZone });

  return (
    <section>
      <HorizontalCalendar matchesDates={matchesDates} />

      <div className={styles.head}>
        <SoccerField size={50} strokeWidth={1.5} />
        <p>Encuentros <span>(temporada regular)</span> </p>
      </div>

      <div className={styles.content}>
        {(matches.length > 0) ? matches.map((match, index) => (
          <div key={match.id} className="relative">
            <Link
              href={`/resultados/${match.id}`}
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
                            match.status === MATCH_STATUS.CANCELED
                          ) && <Minus strokeWidth={5} width={15} />
                        }
                        {match.status === MATCH_STATUS.COMPLETED && match.localScore}
                      </span>
                      {
                        (
                          match.status === MATCH_STATUS.SCHEDULED ||
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
        )) : (
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
      {(pagination.totalPages > 1) && (
        <section className={styles.pagination}>
          <Pagination totalPages={pagination.totalPages} propName="next-matches" />
        </section>
      )}
    </section>
  );
};
