'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import styles from './styles.module.css';

export const FormWeekSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tournamentParam = searchParams.get('tournament');
  const categoryParam = searchParams.get('category');
  const sortedWeek = searchParams.get('sort-week');
  const selectedWeek = searchParams.get('selected-week');

  const [weekValue, setWeekValue] = useState(() => {
    return Number(selectedWeek ?? sortedWeek ?? 0);
  });

  const [debouncedWeek] = useDebounce(weekValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('selected-week', String(debouncedWeek));
    params.set('sort-week', String(debouncedWeek));
    router.replace(`${pathname}?${params}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedWeek, pathname, router]);

  if (!tournamentParam || !categoryParam) return null;

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWeekValue(Number(event.target.value) || 0);
  };

  const handleIncrementWeek = () => {
    setWeekValue(prev => (prev > 0) ? prev - 1 : prev);
  };

  const handleDecrementWeek = () => {
    setWeekValue(prev => prev + 1);
  };

  return (
    <div className={styles.weekSelector}>
      <label htmlFor="selected-week" className={styles.weekLabel}>
        <span>Jornada</span>
      </label>

      <div className={styles.weekGroup}>
        <Button
          variant="outline-primary"
          type="button"
          size="icon"
          onClick={handleIncrementWeek}
          className={styles.modifyQuantityButtons}
        >
          <MinusIcon className="size-6" strokeWidth={3} />
        </Button>
        <input
          id="selected-week"
          name="selected-week"
          min={0}
          value={weekValue}
          onChange={onInputChange}
          className={styles.weekInput}
        />
        <Button
          variant="outline-primary"
          type="button"
          size="icon"
          className={styles.modifyQuantityButtons}
          onClick={handleDecrementWeek}
        >
          <PlusIcon className="size-6" />
        </Button>
      </div>
    </div>
  );
};
