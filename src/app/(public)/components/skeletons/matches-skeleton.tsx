import type { FC } from 'react';

export const MatchesSkeleton: FC = () => {

  return (
    <div className="animate-pulse">
      <div className="bg-gray-500 h-12 rounded-t" />
      <div className="border border-gray-900/90 rounded-b-lg p-5 flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, row) => (
          (row === 1) ? (
            <div key={`row-${row}`} className="w-full h-0.5 bg-gray-300" />
          ) : (
            <div key={`row-${row}`} className="grid grid-cols-[300px_1fr_200px_1fr] items-center gap-5">
              <div className="grid grid-rows-4 gap-2">
                {Array.from({ length: 4 }).map((_, data) => (
                  <div key={`data-${data}`} className="w-full h-5 bg-gray-400 rounded" />
                ))}
              </div>
              <div className="w-full h-8 bg-gray-400 rounded" />
              <div className="grid grid-rows-2 gap-2">
                {Array.from({ length: 2 }).map((_, scheduleDate) => (
                  <div key={`scheduleDate-${scheduleDate}`} className="w-full h-5 bg-gray-400 rounded" />
                ))}
              </div>
              <div className="w-full h-8 bg-gray-400 rounded" />
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default MatchesSkeleton;
