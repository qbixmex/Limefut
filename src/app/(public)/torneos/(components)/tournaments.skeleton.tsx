import type { FC } from "react";

export const TournamentsSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {Array.from({ length: 4 }).map((_, row) => (
        <div key={`row-${row}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_,col) => (
            <div key={`col-${col}`} className="bg-gray-600 w-full h-30 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TournamentsSkeleton;
