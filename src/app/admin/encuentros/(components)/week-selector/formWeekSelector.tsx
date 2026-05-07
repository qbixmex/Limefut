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
  const sortedWeek = searchParams.get('sortWeek');
  const selectedWeek = searchParams.get('semana');
  const tournamentSearchParam = searchParams.get('torneo');

  const [weekValue, setWeekValue] = useState(() => {
    return Number(selectedWeek ?? sortedWeek ?? 0);
  });

  const [debouncedWeek] = useDebounce(weekValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('semana', String(debouncedWeek));
    params.set('sortWeek', String(debouncedWeek));
    router.push(`${pathname}?${params}`);
  }, [debouncedWeek, pathname, router, searchParams]);

  if (!tournamentSearchParam) return null;

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
      <label htmlFor="week" className={styles.weekLabel}>
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
          id="week"
          name="week"
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
