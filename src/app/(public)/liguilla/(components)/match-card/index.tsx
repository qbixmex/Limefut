import type { FC } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export type Team = {
  id: string | null;
  name: string | null;
  permalink: string | null;
  imageUrl?: string | null;
};

export type Match = {
  id: string;
  localTeam: Team;
  visitorTeam: Team;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: string | null;
  winnerId: string | null;
  penaltyShoots?: {
    localGoals: number;
    visitorGoals: number;
    winnerTeamId: string | null;
  } | null;
  status: 'scheduled' | 'completed' | 'canceled';
};

type Props = Readonly<{
  match: Match | undefined;
  winner?: 'local' | 'visitor' | null;
  isJustFinal?: boolean;
}>;

export const MatchCard: FC<Props> = ({ match, winner, isJustFinal = false }) => {
  if (!match) return null;
  const isScheduled = match.status === 'scheduled';
  const hasScore = match.localScore !== null && match.visitorScore !== null;

  return (
    <div className={cn(styles.cardContainer, { 'max-w-1/4': isJustFinal })}>
      <div className={styles.teamRow}>
        <div
          className={cn({
            [styles.teamDataColumns]: match.localTeam.imageUrl,
            [styles.teamData]: !match.localTeam.imageUrl,
          })}
        >
          {match.localTeam.imageUrl && (
            <Image
              src={match.localTeam.imageUrl}
              width={40}
              height={40}
              alt={`${match.localTeam.name} imagen`}
              className="rounded"
              style={{ width: 40, height: 40 }}
            />
          )}
          <span
            className={cn(styles.teamName, {
              [styles.winnerTeamName]: winner === 'local',
            })}
          >
            {match.localTeam.name}
          </span>
        </div>
        <div className={styles.matchScores}>
          {match.penaltyShoots && (
            <span
              className={cn(styles.penaltyShoots, {
                [styles.winnerTeamScore]: match.penaltyShoots && winner === 'local',
              })}
            >
              ({match.penaltyShoots.localGoals})
            </span>
          )}
          <span className={styles.matchScore}>
            {isScheduled ? '-' : !hasScore ? '-' : (
              <span
                className={cn({
                  [styles.winnerTeamScore]: winner === 'local' && !match.penaltyShoots,
                })}
              >
                {match.localScore}
              </span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.teamRow}>
        <div
          className={cn({
            [styles.teamDataColumns]: match.visitorTeam.imageUrl,
            [styles.teamData]: !match.visitorTeam.imageUrl,
          })}
        >
          {match.visitorTeam.imageUrl && (
            <Image
              src={match.visitorTeam.imageUrl}
              width={40}
              height={40}
              alt={`${match.visitorTeam.name} imagen`}
              className={styles.teamImage}
              style={{ width: 40, height: 40 }}
            />
          )}
          <span
            className={cn(styles.teamName, {
              [styles.winnerTeamName]: winner === 'visitor',
            })}
          >
            {match.visitorTeam.name}
          </span>
        </div>
        <div className={styles.matchScores}>
          {match.penaltyShoots && (
            <span
              className={cn(styles.penaltyShoots, {
                [styles.winnerTeamScore]: match.penaltyShoots && winner === 'visitor',
              })}
            >
              ({match.penaltyShoots.visitorGoals})
            </span>
          )}
          <span
            className={cn(styles.matchScore, {
              [styles.winnerTeamScore]: winner === 'visitor' && !match.penaltyShoots,
            })}
          >
            {isScheduled ? '-' : !hasScore ? '-' : match.visitorScore}
          </span>
        </div>
      </div>

      {match.matchDate && (
        <p className={styles.matchDate}>{match.matchDate}</p>
      )}
    </div>
  );
};
