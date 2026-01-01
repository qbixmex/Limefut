import { cn } from "@/root/src/lib/utils";
import { type FC } from "react";

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
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((row) => (
        <div key={row} className="flex gap-3">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((item) => (
            <div key={item} className={cn("h-5 bg-gray-500 rounded animate-pulse", {
              "w-[250px]": item === 'a',
              "flex-1": item !== 'a',
            })} />
          ))}
        </div>
      ))}
    </div>
  </>
);
