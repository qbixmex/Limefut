export const MessagesSkeleton = () => {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="bg-gray-500 w-full h-10 rounded" />
      
      {Array.from({ length: 3 }).map((_, row) => (
        <div key={`row-${row}`} className="grid grid-cols-[1fr_50px] gap-4">
          {Array.from({ length: 2 }).map((_, col) => (
            <div key={`col-${col}`} className="bg-gray-500 w-full h-8 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MessagesSkeleton;
