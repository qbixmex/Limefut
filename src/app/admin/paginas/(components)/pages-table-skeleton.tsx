import type { FC } from "react";

export const PagesTableSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton Header */}
      <div
        className="grid gap-5 grid-cols-[repeat(2,1fr)_200px_100px_200px]"
      >
        {Array.from({ length: 5 }).map((_, column) => (
          <div key={`header-${column}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: 12 }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 items-center grid-cols-[repeat(2,1fr)_200px_100px_200px]"
        >
          {Array.from({ length: 5 }).map((_, column) => (
            <div key={`header-${column}`} className="w-full h-8 bg-gray-500 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PagesTableSkeleton;
