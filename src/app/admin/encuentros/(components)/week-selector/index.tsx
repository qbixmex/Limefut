'use client';

import type { ChangeEvent, SubmitEvent } from 'react';
import { Fragment, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, SendHorizontal } from 'lucide-react';
import styles from './styles.module.css';

export const WeekSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortedWeek = searchParams.get('sortWeek');
  const selectedWeek = searchParams.get('semana');
  const tournamentSearchParam = searchParams.get('torneo');

  const [weekValue, setWeekValue] = useState(() => {
    return Number(selectedWeek ?? sortedWeek ?? 0);
  });

  if (!tournamentSearchParam) return null;

  const setWeekParam = (week: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('semana', week);
    params.set('sortWeek', week);
    router.push(`${pathname}?${params}`);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    setWeekParam(weekValue.toString());
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWeekValue(Number(event.target.value) || 0);
  };

  return (
    <Fragment key={`week-${sortedWeek ?? 'none'}`}>
      <form onSubmit={handleSubmit}>
        <div className={styles.weekAndSubmit}>
          <div className={styles.weekSelector}>
            <label htmlFor="week" className={styles.weekLabel}>
              <span>Jornada</span>
            </label>
            <div className={styles.weekGroup}>
              <Button
                variant="outline-primary"
                type="button"
                size="icon"
                onClick={() => {
                  setWeekValue(prev => (prev > 0) ? prev - 1 : prev);
                }}
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
                onClick={() => setWeekValue(prev => prev + 1)}
              >
                <PlusIcon className="size-6" />
              </Button>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button variant="outline-primary" type="submit">
              <SendHorizontal />
            </Button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default WeekSelector;
