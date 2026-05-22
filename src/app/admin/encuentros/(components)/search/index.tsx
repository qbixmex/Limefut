'use client';

import type { FC, SubmitEvent } from 'react';
import { useState, useEffect, useId } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

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
    <div className={styles.mainWrapper}>
      <form onSubmit={handleSearch}>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className={styles.searchWrapper}>
          <div className={styles.inputGroup}>
            <input
              name={`term-${searchMatchId}`}
              className={cn('peer', styles.searchInput)}
              placeholder={placeholder}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              value={inputValue}
            />
            <SearchIcon className={styles.searchIcon} />
            <button
              type="button"
              className={styles.closeButton}
              onClick={handleClearSearch}
            >
              <XIcon className={styles.closeIcon} />
            </button>
          </div>
          <Button
            type="submit"
            className={cn('group', styles.submitButton)}
            variant="outline-secondary"
          >
            buscar
          </Button>
        </div>
      </form>
    </div>
  );
};
