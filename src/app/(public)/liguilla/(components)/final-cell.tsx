'use client';

import type { FC } from 'react';
import type { Match } from './match-card';
import { ChampionDisplay } from './champion-display';
import { useBracketRound } from '../use-bracket-round';

export const FinalCell: FC<{
  final: Match;
  isFinalCompleted: boolean;
  championColor: 'amber' | 'slate';
}> = ({ final, isFinalCompleted, championColor }) => {
  const { getWinner } = useBracketRound();

  const winner = getWinner(final);

  return (
    <span className="text-center">
      {isFinalCompleted && winner ? (
        <span className="flex flex-col items-center gap-0.5">
          <ChampionDisplay
            final={final}
            isFinalCompleted={isFinalCompleted}
            championColor={championColor}
          />
        </span>
      ) : (
        <span className="text-lg font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Final
        </span>
      )}
    </span>
  );
};
