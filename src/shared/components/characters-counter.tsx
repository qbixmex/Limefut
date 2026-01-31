import type { FC } from 'react';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  charactersCount: number;
  limit: number;
}>;

export const CharactersCounter: FC<Props> = ({ charactersCount, limit }) => {
  const thresholdWarning = Math.round(limit * 0.8);

  return (
    <>
     { charactersCount > 0 && (
      <div
        className={cn({
          "text-green-500": charactersCount < thresholdWarning,
          "text-amber-500": charactersCount >= thresholdWarning && charactersCount < limit,
          "text-indigo-400": charactersCount === limit,
          "text-red-500": charactersCount > limit,
        })}
      >
        {(charactersCount < limit)
          ? `Restan ${limit - charactersCount} caracteres.`
          : charactersCount === limit
            ? "¡ Límite de caracteres alcanzado !"
            : `¡ Excedido por ${charactersCount - limit} caracteres !`
        }
      </div>
      )}
    </>
  );
};

export default CharactersCounter;
