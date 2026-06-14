import type { FC } from 'react';
import { ShieldQuestion } from 'lucide-react';

export type Team = {
  name: string;
  imageUrl?: string | null;
};

export type Match = {
  id: string;
  localTeam: Team;
  visitorTeam: Team;
  localScore: number | null;
  visitorScore: number | null;
  matchDate: string | null;
  penaltyShoots?: { localGoals: number; visitorGoals: number } | null;
  status: 'scheduled' | 'completed' | 'canceled';
};

type Props = Readonly<{
  match: Match;
  winner?: 'local' | 'visitor' | null;
}>;

export const MatchCard: FC<Props> = ({ match, winner }) => {
  const isScheduled = match.status === 'scheduled';
  const hasScore = match.localScore !== null && match.visitorScore !== null;

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 min-w-[160px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <ShieldQuestion className="size-4 text-gray-400 shrink-0" />
          <span className={`text-sm font-semibold truncate ${winner === 'local' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
            {match.localTeam.name}
          </span>
        </div>
        <span className={`font-bold text-base tabular-nums shrink-0 ml-2 ${winner === 'local' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>
          {isScheduled ? '-' : hasScore ? match.localScore : '?'}
        </span>
      </div>

      {match.penaltyShoots && (
        <div className="flex justify-end text-[10px] text-gray-500 -mt-0.5 mr-1">
          ({match.penaltyShoots.localGoals})
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <ShieldQuestion className="size-4 text-gray-400 shrink-0" />
          <span className={`text-sm font-semibold truncate ${winner === 'visitor' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
            {match.visitorTeam.name}
          </span>
        </div>
        <span className={`font-bold text-base tabular-nums shrink-0 ml-2 ${winner === 'visitor' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>
          {isScheduled ? '-' : hasScore ? match.visitorScore : '?'}
        </span>
      </div>

      {match.penaltyShoots && (
        <div className="flex justify-end text-[10px] text-gray-500 -mt-0.5 mr-1">
          ({match.penaltyShoots.visitorGoals})
        </div>
      )}

      {match.matchDate && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 pt-1.5 border-t border-gray-200 dark:border-gray-700 text-center">
          {match.matchDate}
        </p>
      )}
    </div>
  );
};
