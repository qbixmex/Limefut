export const BannersSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr_repeat(2,100px)_150px]">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, row) => (
        <div key={row} className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_1fr_repeat(2,100px)_150px] place-items-center">
          {Array.from({ length: 5 }).map((_, col) => (
            (col === 0) ? (
              <div key={col} className="w-full h-25 bg-gray-500 rounded" />
            ) : (
              <div key={col} className="w-full h-8 bg-gray-500 rounded" />
            )
          ))}
        </div>
      ))}
    </div>
  );
};

export default BannersSkeleton;