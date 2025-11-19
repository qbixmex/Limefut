export const StandingsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-[1fr_repeat(7,70px)_120px] gap-5 mb-5">
        {Array.from({ length: 9 }).map((_, head) => (
          <div key={`head-${head}`} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {Array.from({ length: 10 }).map((_, row) => (
          <div key={`row-${row}`} className="grid grid-cols-[1fr_repeat(7,70px)_120px] gap-5">
            {Array.from({ length: 9 }).map((_, col) => (
              <div key={`col-${col}`} className="w-full h-8 bg-gray-500 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandingsSkeleton;