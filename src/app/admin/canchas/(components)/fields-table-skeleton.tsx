import type { FC } from 'react';

type Props = Readonly<{
  colCount?: number;
  rowCount?: number;
}>;

export const FieldsTableSkeleton: FC<Props> = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse mt-10">
      {/* Skeleton Header */}
      <div className="grid gap-5 grid-cols-[48px_1fr_repeat(3,100px)_120px]">
        {Array.from({ length: 6 }).map((_, column) => (
          <div key={`header-${column}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: 12 }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 grid-cols-[48px_1fr_repeat(3,100px)_120px]"
        >
          {Array.from({ length: 6 }).map((_, column) => (
            <div
              key={`row-${row}-column-${column}`}
              className="w-full h-6 bg-gray-500 rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
};
