'use client';

import { type FC, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon, XIcon } from 'lucide-react';

type Props = Readonly<{
  placeholder?: string;
}>;

export const Search: FC<Props> = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toString() ?? '';
  const pathname = usePathname();
  const router = useRouter();
  const [ inputValue, setInputValue ] = useState(query);

  // Synchronize input value with URL param.
  // This is useful if the user navigates with browser back and forward button.
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClearSearch = () => {
    setInputValue('');
    handleSearch('');
  };

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">Search</label>
      <input
        className="peer block w-80 rounded-md border border-gray-500 focus:border-blue-500 py-[9px] pl-10 text-sm outline-0 placeholder:text-gray-500 text-gray-400 italic"
        placeholder={placeholder}
        onChange={(event) => {
          setInputValue(event.target.value);
          handleSearch(event.target.value);
        }}
        value={inputValue}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-blue-400" />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleClearSearch}
      >
        <XIcon className="size-4.5 text-gray-500" />
      </button>
    </div>
  );

};

export default Search;
