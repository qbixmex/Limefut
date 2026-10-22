export const PlayoffMatchSkeleton = () => {
  return (
    <div className="animate-pulse" role="status" aria-label="Cargando datos">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5 lg:mb-10">
        <div className="w-full h-[250px] bg-gray-500 rounded" />

        <div className="flex flex-col gap-5">
          {
            Array.from({ length: 8 }).map((_, row) => (
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
  );
};
