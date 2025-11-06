export const UsersTableSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="grid grid-cols-[80px_repeat(5,1fr)_200px] gap-5">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((item) => (
          <div key={item} className="w-full h-5 bg-gray-500 rounded" />
        ))}
      </div>
      {['row-1', 'row-2', 'row-3', 'row-4', 'row-5', 'row-6'].map((row) => (
        <div key={row} className="grid grid-cols-[80px_repeat(5,1fr)_200px] gap-5 items-center">
          {['col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6', 'col-7'].map((col) => (
            <div key={col} className={`w-full ${(col == 'col-1') ? 'h-20' : 'h-5'} bg-gray-500 rounded`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default UsersTableSkeleton;
