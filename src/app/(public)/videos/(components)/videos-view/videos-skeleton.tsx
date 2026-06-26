import { VideoIcon } from 'lucide-react';

export const VideosSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {Array.from({ length: 2 }).map((_, row) => (
        <section key={`${row}-row`} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={`${col}-column`} className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-5 rounded-lg">
              <div className="w-full h-50 bg-gray-400/50 rounded grid place-content-center mb-3">
                <VideoIcon size={100} className="stroke-gray-300" strokeWidth={1.5} />
              </div>
              <div className="w-full h-5 bg-gray-400 dark:bg-gray-500 mb-2 rounded" />
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="size-5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                  <div className="w-full h-5 bg-gray-400 dark:bg-gray-500 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-5 bg-gray-400 dark:bg-gray-500 rounded-full" />
                  <div className="size-5 w-full h-5 bg-gray-400 dark:bg-gray-500 rounded" />
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};
