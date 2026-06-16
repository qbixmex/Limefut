import type { FC } from 'react';
import { ShieldQuestion } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    <div className={cn('w-full min-w-[250px] flex flex-col gap-2 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow', {
      'max-w-1/4': isJustFinal,
    })}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {!match.localTeam.imageUrl ? (
            <ShieldQuestion className="size-4 text-gray-400 shrink-0" />
          ) : (
            <Image
              src={match.localTeam.imageUrl}
              width={40}
              height={40}
              alt={`${match.localTeam.name} imagen`}
              className="rounded"
              style={{ width: 40, height: 40 }}
            />
          )}
          <span className={`text-sm font-semibold truncate ${winner === 'local' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
            {match.localTeam.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {match.penaltyShoots && (
            <div className="flex justify-end text-[10px] font-semibold text-gray-500">
              ({match.penaltyShoots.localGoals})
            </div>
          )}
          <span className={`font-bold text-base tabular-nums shrink-0 ${winner === 'local' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>
            {isScheduled ? '-' : hasScore ? match.localScore : '-'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {!match.visitorTeam.imageUrl ? (
            <ShieldQuestion className="size-4 text-gray-400 shrink-0" />
          ) : (
            <Image
              src={match.visitorTeam.imageUrl}
              width={40}
              height={40}
              alt={`${match.visitorTeam.name} imagen`}
              className="rounded"
              style={{ width: 40, height: 40 }}
            />
          )}
          <span className={`text-sm font-semibold truncate ${winner === 'visitor' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
            {match.visitorTeam.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {match.penaltyShoots && (
            <div className="flex justify-end text-[10px] font-semibold text-gray-500">
              ({match.penaltyShoots.visitorGoals})
            </div>
          )}
          <span className={`font-bold text-base tabular-nums shrink-0 ${winner === 'local' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>
            {isScheduled ? '-' : hasScore ? match.visitorScore : '-'}
          </span>
        </div>
      </div>

      {match.matchDate && (
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700 text-center">
          {match.matchDate}
        </p>
      )}
    </div>
  );
};
