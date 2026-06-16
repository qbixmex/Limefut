'use client';

import { useEffect, type FC } from 'react';
import { Trophy } from 'lucide-react';
import { confetti } from '@tsparticles/confetti';
import type { Match } from './match-card';
import { useBracketRound } from '../use-bracket-round';
import Image from 'next/image';

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

  const winnerTeam = (winner === 'local') ? final.localTeam : final.visitorTeam;

  return isFinalCompleted && winner ? (
    <div className="flex flex-col items-center gap-2 mt-5">
      {(final.winnerId || final.penaltyShoots?.winnerTeamId) && (
        <Image
          src={winnerTeam.imageUrl as string}
          width={0}
          height={0}
          alt={`${winnerTeam.name} imagen`}
          loading="eager"
          className={`rounded border-4 w-[200px] h-[200px] object-cover ${
            championColor === 'amber' ? 'border-amber-500' : 'stroke-slate-400'}`}
        />
      )}
      <span className={`text-2xl font-black uppercase ${
        championColor === 'amber' ? 'text-orange-500' : 'stroke-slate-400'}`
      }>
        {winner === 'local' ? final.localTeam.name : final.visitorTeam.name}
      </span>
      <Trophy
        size={128}
        className={`shrink-0 ${championColor === 'amber' ? 'stroke-amber-500' : 'stroke-slate-400'}`}
        strokeWidth={1.5}
      />
      <span className={`text-xl font-bold ${championColor === 'amber' ? 'text-amber-500' : 'text-slate-400'}`}>
        Campeón
      </span>
    </div>
  ) : null;
};
