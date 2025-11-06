import type { FC } from "react";

type Props = Readonly<{
  colCount?: number;
  rowCount?: number;
}>;

export const TeamsTableSkeleton: FC<Props> = ({ colCount = 5, rowCount = 2 }) => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton Header */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: `80px repeat(${colCount - 2},1fr) 200px` }}
      >
        {Array.from({ length: colCount }).map((_, column) => (
          <div key={`header-${column}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: rowCount }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 items-center"
          style={{ gridTemplateColumns: `80px repeat(${colCount - 2},1fr) 200px` }}
        >
          {Array.from({ length: colCount }).map((_, column) => (
            <div key={`row-${row}-column-${column}`} className={`w-full ${column === 0 ? 'h-20' : 'h-5'} bg-gray-500 rounded`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TeamsTableSkeleton;
