export const TeamsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-5">
        {Array.from({ length: 10 }).map((_, row) => (
          <div key={`row-${row}`} className="grid grid-cols-[50px_120px] items-center gap-5">
            <div className="size-[50px] bg-gray-500 rounded" />
            <div className="w-[300px] h-5 bg-gray-500 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsSkeleton;
