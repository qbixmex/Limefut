export const PageSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        <div className="w-full h-[250px] lg:h-[400px] bg-gray-500 rounded-lg" />
        <div className="flex flex-col gap-5">
          <div className="w-3/4 h-10 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-1/2 h-8 bg-gray-500 rounded-lg" />
        </div>
      </div>
      <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <div className="w-3/4 h-10 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-full h-8 bg-gray-500 rounded-lg" />
          <div className="w-1/2 h-8 bg-gray-500 rounded-lg" />
        </div>
        <div className="w-full h-[250px] lg:h-[400px] bg-gray-500 rounded-lg" />
      </div>
    </div>
  );
};
