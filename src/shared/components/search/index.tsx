'use client';

import { type FC, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { SearchIcon, XIcon } from 'lucide-react';
import "./styles.css";

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
  }, 500);

  const handleClearSearch = () => {
    setInputValue('');
    handleSearch('');
  };

  return (
    <div className="main-wrapper">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer input"
        placeholder={placeholder}
        onChange={(event) => {
          setInputValue(event.target.value);
          handleSearch(event.target.value);
        }}
        value={inputValue}
      />
      <SearchIcon className="searchIcon" />
      <button
        className="button"
        onClick={handleClearSearch}
      >
        <XIcon className="closeIcon" />
      </button>
    </div>
  );

};

export default Search;
