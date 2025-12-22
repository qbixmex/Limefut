export const FormSkeleton = () => {
  return (
    <div className="mt-10 space-y-5 animate-pulse">
      <div className="flex gap-5">
        <div className="w-1/2 space-y-5">
          <div className="w-full bg-gray-500 h-10 rounded-lg" />
          <div className="w-full bg-gray-500 h-10 rounded-lg" />
        </div>
        <div className="w-1/2 space-y-5">
          <div className="w-full bg-gray-500 h-10 rounded-lg" />
          <div className="w-full bg-gray-500 h-10 rounded-lg" />
        </div>
      </div>
      <div>
        <div className="w-1/2 flex gap-5">
          <div className="w-2/4 bg-gray-500 h-8 rounded-lg" />
          <div className="w-1/4 bg-gray-500 h-8 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="w-1/2 flex justify-end gap-5">
          <div className="w-1/4 bg-gray-500 h-10 rounded-lg" />
          <div className="w-1/4 bg-gray-500 h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;