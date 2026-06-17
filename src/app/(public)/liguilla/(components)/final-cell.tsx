'use client';

import type { FC } from 'react';
import type { Match } from './match-card';
import { ChampionDisplay } from './champion-display';
import { useBracketRound } from '../use-bracket-round';

export const FinalCell: FC<{
  final: Match;
  isFinalCompleted: boolean;
  championColor: 'gold' | 'silver' | 'general';
}> = ({ final, isFinalCompleted, championColor }) => {
  const { getWinner } = useBracketRound();

  const winner = getWinner(final);

  return (
    <>
      {isFinalCompleted && winner && (
        <span className="flex flex-col items-center gap-0.5">
          <ChampionDisplay
            final={final}
            isFinalCompleted={isFinalCompleted}
            championColor={championColor}
          />
        </span>
      )}
    </>
  );
};
