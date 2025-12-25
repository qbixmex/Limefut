export const LatestResultsSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="w-full h-8 bg-gray-500 rounded" />
      {Array.from({ length: 4 }).map((_, row) => (
        <div key={`row-${row}`} className="w-full h-6 bg-gray-500 rounded" />
      ))}
    </div>
  );
};

export default LatestResultsSkeleton;
