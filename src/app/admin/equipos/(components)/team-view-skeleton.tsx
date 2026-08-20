export const TeamViewSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 xl:grid-cols-[512px_1fr] gap-5 mb-10">
        <div className="w-full h-[512px] bg-gray-500 rounded" />

        <div className="flex flex-col gap-5">
          {
            Array.from({ length: 10 }).map((_, row) => (
              <div key={`col-${row}`} className="flex gap-5">
                <div className="w-25">
                  <div className="w-full h-8 bg-gray-500 rounded" />
                </div>
                <div className="flex-1">
                  <div className="w-full h-8 bg-gray-500 rounded" />
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-1/2">
          <div className="w-50 h-8 bg-gray-500 rounded mb-5" />
          <div className="flex flex-wrap gap-5">
            {
              Array.from({ length: 12 }).map((_, col) => (
                <div key={`col-${col}`} className="w-30 h-10 bg-gray-500 rounded" />
              ))
            }
          </div>
        </div>

        <div className="w-1/2">
          <div className="w-100 h-8 bg-gray-500 rounded mb-5" />
          <div className="flex flex-col gap-5">
            {
              Array.from({ length: 6 }).map((_, row) => (
                <div key={`col-${row}`} className="flex gap-5">
                  <div className="w-25">
                    <div className="w-full h-8 bg-gray-500 rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-8 bg-gray-500 rounded" />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};
