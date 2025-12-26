export const ImagesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 animate-pulse">
      <div className="bg-gray-500 w-full h-25 rounded" />
      <div className="bg-gray-500 w-full h-25 rounded" />
      <div className="bg-gray-500 w-full h-25 rounded" />
      <div className="bg-gray-500 w-full h-25 rounded" />
    </div>
  );
};

export default ImagesSkeleton;
