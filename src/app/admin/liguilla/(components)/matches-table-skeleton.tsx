export const MatchesTableSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-[1fr_repeat(6,100px)_1fr] gap-5 mb-5">
        {Array.from({ length: 8 }).map((_, col) => (
          <div key={`${col}-col`} className="w-full h-5 bg-gray-500 rounded-md" />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={`${row}-row`} className="grid grid-cols-[1fr_repeat(6,100px)_1fr] gap-5">
            {Array.from({ length: 8 }).map((_, col) => (
              <div key={`${col}-col`} className="w-full h-8 bg-gray-500 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
