export const AnnouncementsTableSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-[repeat(2,1fr)_100px_150px] gap-5 mb-5">
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={`col-${col}`} className="w-full h-5 bg-gray-500 rounded-lg" />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {Array.from({ length: 10 }).map((_, row) => (
          <div key={`row-${row}`} className="grid grid-cols-[repeat(2,1fr)_100px_150px] place-items-center gap-5">
            {Array.from({ length: 4 }).map((_, col) => (
              <div key={`col-${col}`} className="w-full h-8 bg-gray-500 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
