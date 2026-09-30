import type { FC } from 'react';

type Props = Readonly<{
  colCount?: number;
  rowCount?: number;
}>;

export const BannersTableSkeleton: FC<Props> = ({ colCount = 5, rowCount = 4 }) => {
  const gridTemplateColumns = `200px 1fr repeat(${colCount - 3},100px) 150px`;

  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton Header */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns }}
      >
        {Array.from({ length: colCount }).map((_, column) => (
          <div key={`header-${column}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: rowCount }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 place-items-center"
          style={{ gridTemplateColumns }}
        >
          {Array.from({ length: colCount }).map((_, column) => (
            <div
              key={`row-${row}-column-${column}`}
              className={`w-full ${column === 0 ? 'h-25' : 'h-8'} bg-gray-500 rounded`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
