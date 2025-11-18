import type { FC } from "react";

export const MessagesTableSkeleton: FC = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* Skeleton Header */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "200px repeat(2,1fr) 250px" }}
      >
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={`header-${col}`} className="w-full h-5 bg-gray-500 rounded" />
        ))

        }
      </div>
      {/* Skeleton Body Rows */}
      {Array.from({ length: 12 }).map((_, row) => (
        <div
          key={`row-${row}`}
          className="grid gap-5 items-center"
          style={{ gridTemplateColumns: "200px repeat(2,1fr) 250px" }}
        >
          {Array.from({ length: 4 }).map((_, column) => (
            <div key={`row-${row}-column-${column}`} className={`w-full h-8 bg-gray-500 rounded`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessagesTableSkeleton;
