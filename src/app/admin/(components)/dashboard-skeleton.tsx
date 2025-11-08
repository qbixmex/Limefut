import { SoccerPlayer } from '@/shared/components/icons';

export const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-[300px_1fr] w-full h-screen animate-pulse">
      <div className="flex flex-col bg-gray-800 p-5">
        <div className="flex-1">
          <div className="w-full h-10 bg-gray-500 rounded mb-10" />
          {Array.from({ length: 12 }).map((_, link) => (
            <div key={`link-${link}`} className="w-full h-5 bg-gray-500 rounded mb-5" />
          ))}
        </div>
        <div className="flex items-center gap-5">
          <div className="rounded-full bg-gray-500 size-10" />
          <div className="rounded bg-gray-500 w-3/4 h-5" />
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, block) => (
            <div key={`block-${block}`} className="h-50 bg-gray-800 rounded-lg" />
          ))}
        </div>
        <div className="flex-1 grid place-content-center bg-gray-800 rounded-lg">
          <SoccerPlayer className="animate-pulse" size={300} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;