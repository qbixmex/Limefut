export const CarouselSkeleton = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-5 animate-pulse">
      <div className="w-full bg-gray-500 rounded-lg h-100" />
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div className="bg-gray-500 size-12 rounded-full" />
          <div className="bg-gray-500 size-12 rounded-full" />
        </div>
        <div className="flex items-center gap-5">
          <div className="bg-gray-500 size-8 rounded-full" />
          <div className="bg-gray-500 size-8 rounded-full" />
          <div className="bg-gray-500 size-8 rounded-full" />
          <div className="bg-gray-500 size-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
