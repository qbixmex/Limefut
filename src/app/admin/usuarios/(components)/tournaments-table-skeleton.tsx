import type { FC } from "react";

type Props = Readonly<{
  colCount?: number;
  rowCount?: number;
}>;

export const TournamentsTableSkeleton: FC<Props> = ({ colCount = 5, rowCount = 2 }) => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton Header */}
      <div className="grid grid-cols-[80px_repeat(5,1fr)_200px] gap-5">
        {Array.from({ length: colCount }).map((_, column) => (
          <div key={`header-${column}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: rowCount }).map((_, row) => (
        <div key={`row-${row}`} className="grid grid-cols-[80px_repeat(5,1fr)_200px] gap-5 items-center">
          {Array.from({ length: colCount }).map((_, column) => (
            <div key={`row-${row}-column-${column}`} className={`w-full ${column === 0 ? 'h-20' : 'h-5'} bg-gray-500 rounded`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TournamentsTableSkeleton;
