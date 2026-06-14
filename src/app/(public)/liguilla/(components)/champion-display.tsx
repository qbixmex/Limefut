'use client';

import { useEffect, type FC } from 'react';
import { Trophy } from 'lucide-react';
import { confetti } from '@tsparticles/confetti';
import type { Match } from './match-card';
import { useBracketRound } from '../use-bracket-round';

export const ChampionDisplay: FC<{
  final: Match;
  isFinalCompleted: boolean;
  championColor: 'amber' | 'slate';
}> = ({ final, isFinalCompleted, championColor }) => {
  const { getWinner } = useBracketRound();
  const winner = getWinner(final);

  useEffect(() => {
    if (isFinalCompleted) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a'],
      });
    }
  }, [isFinalCompleted]);

  return isFinalCompleted && winner ? (
    <div className="flex flex-col items-center gap-2">
      <Trophy
        size={128}
        className={`shrink-0 ${championColor === 'amber' ? 'stroke-amber-500' : 'stroke-slate-400'}`}
        strokeWidth={1.5}
      />
      <span className="text-xl font-bold text-primary">
        {winner === 'local' ? final.localTeam.name : final.visitorTeam.name}
      </span>
      <span className={`text-2xl font-bold ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
        Campeón
      </span>
    </div>
  ) : null;
};
