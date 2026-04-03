import { cn } from '@/lib/utils';

export const NewsTableSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-[120px_200px_repeat(3,50px)_repeat(2,100px)_repeat(2,120px)_150px] gap-5 mb-5">
        {Array.from({ length: 10 }).map((_, col) => (
          <div key={`col-${col}`} className="w-full h-5 bg-gray-500 rounded-lg" />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={`row-${row}`} className="grid grid-cols-[120px_200px_repeat(3,50px)_repeat(2,100px)_repeat(2,120px)_150px] place-items-center gap-5">
            {Array.from({ length: 10 }).map((_, col) => (
              <div key={`col-${col}`} className={cn('w-full bg-gray-500 rounded-lg', {
                'h-5': col !== 0,
                'h-25': col === 0,
              })} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
