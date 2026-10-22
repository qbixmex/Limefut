export const MatchViewSkeleton = () => {
  return (
    <div className="animate-pulse" role="status" aria-label="Cargando datos">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="w-full max-w-[512px] h-[250px] bg-gray-500 rounded" />

        <div className="flex flex-col gap-5">
          {
            Array.from({ length: 7 }).map((_, row) => (
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
