import type { FC } from 'react';

export const TournamentsSelectorSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="w-full lg:w-1/2 h-10 bg-gray-600 rounded-lg" />
      <div className="w-full lg:w-1/2 h-10 bg-gray-600 rounded-lg" />
    </div>
  );
};

export default TournamentsSelectorSkeleton;
