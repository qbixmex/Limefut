'use client';

import { useEffect, type FC } from 'react';
import { Trophy } from 'lucide-react';
import { confetti } from '@tsparticles/confetti';
import type { Match } from '../match-card';
import { useBracketRound } from '../../use-bracket-round';
import Image from 'next/image';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

export const ChampionDisplay: FC<{
  final: Match;
  isFinalCompleted: boolean;
  championColor: 'gold' | 'silver' | 'general';
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
    <div className={styles.championDisplayContainer}>
      {(final.winnerId || final.penaltyShoots?.winnerTeamId) && (
        <Image
          src={winnerTeam.imageUrl as string}
          width={0}
          height={0}
          alt={`${winnerTeam.name} imagen`}
          loading="eager"
          className={styles.winnerTeamImage}
        />
      )}
      <span
        className={cn(styles.winnerTeamName, {
          [styles.goldColor]: championColor === 'gold',
          [styles.silverColor]: championColor === 'silver',
        })}
      >
        {winner === 'local' ? final.localTeam.name : final.visitorTeam.name}
      </span>
      <Trophy
        size={128}
        className={cn('shrink-0', {
          [styles.goldColor]: championColor === 'gold',
          [styles.silverColor]: championColor === 'silver',
        })}
        strokeWidth={1.5}
      />
      <span
        className={cn(styles.championLabel, {
          [styles.goldColor]: championColor === 'gold',
          [styles.silverColor]: championColor === 'silver',
        })}
      >
        Campeón
      </span>
    </div>
  ) : null;
};
