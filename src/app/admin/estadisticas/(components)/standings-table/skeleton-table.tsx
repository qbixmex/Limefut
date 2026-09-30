import { cn } from '@/lib/utils';
import { type FC } from 'react';

export const SkeletonTable: FC = () => (
  <>
    <div className="flex gap-5 mb-10">
      {['left', 'right'].map((side) => (
        <div key={side} className="w-full lg:w-1/2 flex flex-col gap-2 animate-pulse">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex gap-2">
              <div className="w-[100px] h-5 bg-gray-500 rounded" />
              <div className="flex-1 h-5 bg-gray-500 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-5">
      {Array.from({ length: 12 }).map((_, row) => (
        <div key={`row-${row}`} className="flex gap-3">
          {Array.from({ length: 8 }).map((_, col) => (
            <div
              key={`col-${col}`}
              className={
                cn('h-5 bg-gray-500 rounded animate-pulse', {
                  'w-[250px]': col === 0,
                  'flex-1': col > 0,
                })
              }
            />
          ))}
        </div>
      ))}
    </div>
  </>
);
