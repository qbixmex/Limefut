export const LeadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-500 w-full h-10 rounded mb-5" />
      <div className="flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={`row-${row}`} className="grid grid-cols-2 gap-5">
            <div className="bg-gray-500 w-full h-8 rounded" />
            <div className="bg-gray-500 w-full h-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadingSkeleton;
