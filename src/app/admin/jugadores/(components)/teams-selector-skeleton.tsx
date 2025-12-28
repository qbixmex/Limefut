import type { FC } from 'react';

export const TeamsSelectorSkeleton: FC = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full max-w-[400px] h-10 bg-gray-600 rounded-lg" />
    </div>
  );
};

export default TeamsSelectorSkeleton;
