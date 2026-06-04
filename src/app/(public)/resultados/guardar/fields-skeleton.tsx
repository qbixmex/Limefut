export const FieldsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 2 }).map((_, row) => (
        <div key={`rows-${row}`} className="space-y-2 mb-5">
          <div className="w-30 h-5 bg-gray-500 rounded-md" />
          <div className="w-full h-8 bg-gray-500 rounded-md" />
        </div>
      ))}
    </div>
  );
};
