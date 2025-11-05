'use client';

import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import { updateStatusAction } from "../../(actions)/updateMatchScore";
import { toast } from "sonner";

type Props = Readonly<{
  matchId: string;
  score: number;
  local?: boolean;
  visitor?: boolean;
}>;

export const MatchScoreInput: FC<Props> = (props) => {
  const { matchId, score, local = false, visitor = false } = props;
  const [ scoreValue, setScoreValue ] = useState<string>(String(score));

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

    const response = await updateStatusAction({
      matchId,
      score: finalScore,
      local,
      visitor
    });

    if (!response.ok) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <input
      name="score"
      type="number"
      min={0}
      value={scoreValue}
      onChange={onInputChange}
      onBlur={handleBlur}
      className="w-[50px] border p-2 rounded-lg text-blue-500 border-blue-500"
    />
  );
};

export default MatchScoreInput;
