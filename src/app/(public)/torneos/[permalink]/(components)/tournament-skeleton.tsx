import type { FC } from "react";

export const TournamentSkeleton: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-600 w-full max-w-[500px] h-10 rounded-lg mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-5 mb-10">
        <div className="size-[500px] bg-gray-600 rounded-lg" />
        <div className="w-full flex flex-col gap-4">
          {Array.from({ length: 12 }).map((_, row) => (
            <div key={`row-${row}`} className="grid grid-cols-[200px_1fr] gap-5">
              <div className="w-full h-6 bg-gray-600 rounded" />
              <div className="w-full h-6 bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-600 w-full max-w-[250px] h-10 rounded-lg mb-10" />

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-5">
        {Array.from({ length: 12 }).map((_, row) => (
          <div key={`row-${row}`} className="w-full h-16 bg-gray-600 rounded" />
        ))}
      </div>
    </div>
  );
};

export default TournamentSkeleton;
