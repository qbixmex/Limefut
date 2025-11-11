export const HorizontalCalendarSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-700 rounded-t h-10" />
      <div className="border border-gray-400 rounded-b grid grid-cols-14 gap-5 p-5">
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
