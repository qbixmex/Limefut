/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import type { ChangeEvent, ComponentProps, FC } from 'react';
import { useEffect, useState } from 'react';
import { updateMatchInputScoreAction } from '@/app/admin/encuentros/(actions)/update-match-input-score.action';
import { toast } from 'sonner';
import styles from './styles.module.css';

type Props = Readonly<{
  matchId: string;
  score: number;
  local?: boolean;
  visitor?: boolean;
}>;

export const MatchScoreInput: FC<ComponentProps<'input'> & Props> = ({
  score,
  matchId,
  local = false,
  visitor = false,
  ...props
}) => {
  const [scoreValue, setScoreValue] = useState<string>(String(score));

  // Synchronize the internal state if 'score' prop changes from outside.
  useEffect(() => {
    setScoreValue(String(score));
  }, [score]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setScoreValue(event.target.value);
  };

  const handleBlur = async () => {
    const numericValue = Number(scoreValue);
    const finalScore = isNaN(numericValue) ? 0 : numericValue;

    const response = await updateMatchInputScoreAction({
      matchId,
      score: finalScore,
      local,
      visitor,
    });

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
  };

  return (
    <input
      { ...props }
      name="score"
      type="number"
      min={0}
      value={scoreValue}
      onChange={onInputChange}
      onBlur={handleBlur}
      className={styles.input}
    />
  );
};
