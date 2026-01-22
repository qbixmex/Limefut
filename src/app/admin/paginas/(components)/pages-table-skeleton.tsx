import type { FC } from "react";

export const PagesTableSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton Header */}
      <div
        className="grid gap-5 grid-cols-[1fr_repeat(3,200px)]"
      >
        {Array.from({ length: 4 }).map((_, column) => (
          <div key={`header-${column}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: 12 }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 items-center grid-cols-[1fr_repeat(3,200px)]"
        >
          {Array.from({ length: 4 }).map((_, column) => (
            <div key={`header-${column}`} className="w-full h-8 bg-gray-500 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PagesTableSkeleton;
