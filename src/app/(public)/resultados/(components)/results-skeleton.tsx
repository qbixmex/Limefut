import { type FC } from 'react';

export const ResultsSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      {Array.from({ length: 2 }).map((_, week) => (
        <div key={`week-${week}`} className="flex flex-col gap-5">
          <div className="w-50 h-8 bg-gray-600 rounded" />
          <div className="flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, row) => (
              <div key={`row-${row}`} className="grid grid-cols-[1fr_80px_80px_1fr_80px_1fr_120px_50px] gap-5">
                {Array.from({ length: 8 }).map((_, col) => (
                  <div key={`col-${col}`} className="w-full h-8 bg-gray-600 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsSkeleton;
