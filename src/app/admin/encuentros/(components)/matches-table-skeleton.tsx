import type { FC } from 'react';

type Props = Readonly<{
  colCount?: number;
  rowCount?: number;
}>;

export const MatchesTableSkeleton: FC<Props> = ({ colCount = 5, rowCount = 2 }) => {

  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {Array.from({ length: rowCount }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 items-center"
          style={{ gridTemplateColumns: `repeat(${colCount},1fr)` }}
        >
          {Array.from({ length: colCount }).map((_, column) => (
            <div key={`row-${row}-column-${column}`} className={`w-full h-5 bg-gray-500 rounded`} />
          ))}
        </div>
      ))}
    </div>
  );

};

export default MatchesTableSkeleton;
