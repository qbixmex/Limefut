export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-4 gap-5 animate-pulse">
      { Array.from({ length: 8 }).map((_, col) => (
        <div key={`col-${col}`} className="max-w-[300px] h-[300px] bg-gray-500 rounded-lg" />
      ))}
    </div>
  );
};

export default GallerySkeleton;
