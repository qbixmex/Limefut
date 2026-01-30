export const PageFormSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="w-full h-10 bg-gray-500 rounded-lg" />
        <div className="w-full h-10 bg-gray-500 rounded-lg" />
      </div>

      <div className="w-full h-40 bg-gray-500 rounded-lg mb-5" />

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="space-y-5">
          <div className="w-full h-10 bg-gray-500 rounded-lg" />
          <div className="w-full h-10 bg-gray-500 rounded-lg" />
        </div>

        <div className="w-full h-full bg-gray-500 rounded-lg" />
      </div>

      <div className="flex justify-end gap-5 mb-5">
        <div className="w-10 h-5 bg-gray-500 rounded-lg" />
        <div className="w-10 h-5 bg-gray-500 rounded-lg" />
      </div>

      <div className="flex justify-end gap-5">
        <div className="w-40 h-10 bg-gray-500 rounded-lg" />
        <div className="w-40 h-10 bg-gray-500 rounded-lg" />
      </div>
    </div>
  );
};
