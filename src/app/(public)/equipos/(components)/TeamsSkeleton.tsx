export const TeamsSkeleton = () => {
  return (
    <div className="my-10 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={`row-${row}`} className="w-full flex flex-col items-center gap-5">
            <div className="size-[250px] bg-gray-500 rounded" />
            <div className="w-[250px] h-5 bg-gray-500 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsSkeleton;
