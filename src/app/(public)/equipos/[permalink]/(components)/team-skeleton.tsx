export const TeamSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-5 items-center mb-10">
        <div className="size-[50px] bg-gray-500 rounded-lg" />
        <div className="w-1/3 h-10 bg-gray-500 rounded" />
      </div>
      <div className="grid grid-cols-[480px_1fr] gap-5 mb-10">
        <div className="size-[480px] bg-gray-500 rounded-lg" />
        <div className="flex flex-col gap-5">
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={`row-${row}`} className="grid grid-cols-[200px_1fr] gap-5">
              <div className="w-full h-6 bg-gray-500 rounded" />
              <div className="w-full h-6 bg-gray-500 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="w-[200px] h-10 bg-gray-500 rounded" />
        {Array.from({ length: 2 }).map((_, row) => (
          <div key={`row-${row}`} className="w-full flex gap-5">
            {Array.from({ length: 5 }).map((_, col) => (
              <div key={`col-${col}`} className="w-full h-8 bg-gray-500 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSkeleton;