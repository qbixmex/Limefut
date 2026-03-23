'use client';

import type { FC, SubmitEvent } from 'react';
import { useState, useEffect, useId } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SendHorizontal, SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import './styles.css';

type Props = Readonly<{
  placeholder?: string;
}>;

export const Search: FC<Props> = ({ placeholder }) => {
  const searchMatchId = useId();
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toString() ?? '';
  const pathname = usePathname();
  const router = useRouter();
  const [inputValue, setInputValue] = useState(query);

  // Synchronize input value with URL param.
  // This is useful if the user navigates with browser back and forward button.
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const handleSearch = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (inputValue.length > 0) {
      params.set('query', inputValue);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    params.delete('query');
    router.replace(`${pathname}?${params.toString()}`);
    setInputValue('');
  };

  return (
    <div className="main-wrapper">
      <form onSubmit={handleSearch}>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="search-wrapper">
          <div className="input-group">
            <input
              name={`term-${searchMatchId}`}
              className="peer search-input"
              placeholder={placeholder}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              value={inputValue}
            />
            <SearchIcon className="searchIcon" />
            <button
              type="button"
              className="close-button"
              onClick={handleClearSearch}
            >
              <XIcon className="closeIcon" />
            </button>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                className="submit-button group"
                variant="outline-secondary"
              >
                <SendHorizontal className="send-icon" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <span>Buscar</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};
