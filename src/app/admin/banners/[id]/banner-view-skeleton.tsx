import type { FC } from 'react';

export const BannerViewSkeleton: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-64 bg-gray-500 rounded-lg" />

      <div className="flex flex-col lg:flex-row gap-5 mt-10">
        {Array.from({ length: 2 }).map((_, column) => (
          <div
            key={`column-${column}`}
            className="w-full xl:w-1/2 flex flex-col gap-5"
          >
            {Array.from({ length: 4 }).map((_, row) => (
              <div key={`column-${column}-row-${row}`} className="flex gap-5">
                <div className="w-45">
                  <div className="w-full h-8 bg-gray-500 rounded" />
                </div>
                <div className="flex-1">
                  <div className="w-full h-8 bg-gray-500 rounded" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
