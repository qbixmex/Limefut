export const HorizontalCalendarSkeleton = () => {
  return (
    <div
      className="animate-pulse"
      role="status"
      aria-label="Cargando calendario"
    >
      <div className="bg-gray-700 rounded-t h-10" />

      {/* Mobile */}
      <div className="grid grid-cols-3 gap-10 py-5 px-10 border border-gray-400 rounded-b md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`day-${index}`} className="flex flex-col gap-4">
            <div className="w-full h-20 bg-gray-400 rounded" />
            <div className="w-full h-5 bg-gray-400 rounded" />
          </div>
        ))}
      </div>

      {/* Tablet */}
      <div className="hidden md:grid grid-cols-5 gap-18 py-5 px-14 border border-gray-400 rounded-b lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`day-${index}`} className="flex flex-col gap-4">
            <div className="w-full h-20 bg-gray-400 rounded" />
            <div className="w-full h-5 bg-gray-400 rounded" />
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden border border-gray-400 rounded-b lg:grid grid-cols-14 gap-5 p-5">
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={`day-${index}`} className="flex flex-col gap-4">
            <div className="w-full h-20 bg-gray-400 rounded" />
            <div className="w-full h-5 bg-gray-400 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCalendarSkeleton;
