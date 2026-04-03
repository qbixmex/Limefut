export const LatestImagesSkeleton = () => {
  return (
    <section className="animate-pulse">
      <div className="w-full bg-gray-500 h-16 px-5 py-3 rounded-t-lg" />

      <div className="border bg-gray-800 rounded-b-lg p-5">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="w-full h-[300px] bg-gray-500 rounded-lg" />
          <div className="w-full h-[300px] bg-gray-500 rounded-lg" />
          <div className="w-full h-[300px] bg-gray-500 rounded-lg" />
        </section>
      </div>
    </section>
  );
};
