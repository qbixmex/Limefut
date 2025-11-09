export const LoginSkeleton = () => {
  return (
    <div className="flex-1 rounded p-5 flex flex-col item-center justify-center animate-pulse">
      <div className="w-full max-w-md mx-auto p-10 bg-gray-900 rounded-lg">
        <div className="w-3/4 mx-auto h-5 bg-gray-500 mb-10 rounded-lg" />
        <div className="w-40 h-3 bg-gray-500 rounded mb-5" />
        <div className="w-full h-10 border border-gray-500 bg-gray-800/80 rounded-lg mb-10" />
        <div className="w-40 h-3 bg-gray-500 rounded-lg mb-5" />
        <div className="w-full h-10 border border-gray-500 bg-gray-800/80 rounded-lg mb-10" />
        <div className="flex justify-end">
          <div className="w-32 h-10 border border-gray-500 rounded-lg bg-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default LoginSkeleton;