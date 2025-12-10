'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  matchesDates: string[];
}>;

export const PublicCalendar: FC<Props> = ({ matchesDates }) => {
  const today = new Date();
  const RANGE = 7; // days before and after

  const days = Array.from(
    { length: RANGE * 2 + 1 },
    (_, index) => addDays(today, index - RANGE)
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dayRefs = useRef<Array<HTMLElement | null>>([]);

  // center today's element on mount
  useEffect(() => {
    const index = RANGE; // today's index in days array
    const element = dayRefs.current[index];
    const container = containerRef.current;
    if (!element || !container) return;

    const target = element.offsetLeft + element.offsetWidth / 2 - container.clientWidth / 2;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [RANGE]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Calendario de partidos</div>

      <div className={styles.calendar} ref={containerRef} role="list">
        {days.map((d, index) => {
          const isToday = isSameDay(d, today);
          const matchesOnThisDay = matchesDates.filter(
            (matchDate) => isSameDay(d, new Date(matchDate))
          ).length;

          return (
            <div key={d.toISOString()}>
              <div
                ref={(element) => { dayRefs.current[index] = element; }}
                className={cn(styles.day, { [styles.today]: isToday })}
                role="listitem"
                aria-current={isToday ? 'date' : undefined}
              >
                <p className={styles.weekday}>{format(d, 'EEE', { locale: es }).toLowerCase()}</p>
                <p className={styles['day-num']}>{format(d, 'd')}</p>
                <p className={styles.month}>{format(d, 'MMM', { locale: es }).toLowerCase()}</p>
              </div>
              <p className={cn(styles.gamesCount, {
                [styles.todayGamesCount]: (matchesOnThisDay > 0) && isToday,
              })}>
                {matchesOnThisDay}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

};

export default PublicCalendar;
