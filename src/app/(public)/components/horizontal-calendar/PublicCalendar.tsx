'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addDays, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import './styles.css';

type Props = Readonly<{
  matchesDates: string[];
}>;

export const PublicCalendar: FC<Props> = ({ matchesDates }) => {
  const today = new Date();
  const RANGE = 7; // days before and after
  const [currentDay, setCurrentDay] = useState<Date>(today);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const days = Array.from(
    { length: RANGE * 2 + 1 },
    (_, index) => addDays(today, index - RANGE),
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

  const handleSelectDay = (day: Date) => {
    setCurrentDay(day);
    const params = new URLSearchParams(searchParams);
    const dateWithoutTime = day.toISOString().split('T')[0];
    if (isSameDay(day, today)) {
      params.delete('next-matches');
      params.delete('selected-day');
    } else {
      params.set('next-matches', '1');
      params.set('selected-day', dateWithoutTime);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">Calendario de partidos</div>

      <div className="calendar-body" ref={containerRef} role="list">
        {days.map((day, index) => {
          const selectedDay = isSameDay(day, currentDay);
          const matchesOnThisDay = matchesDates.filter(
            (matchDate) => isSameDay(day, new Date(matchDate)),
          ).length;

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleSelectDay(day)}
              className="cursor-pointer"
            >
              <div
                ref={(element) => { dayRefs.current[index] = element; }}
                className={cn('calendar-day', {
                  'calendar-today': selectedDay,
                })}
                role="listitem"
                aria-current={selectedDay ? 'date' : undefined}
              >
                <p className="calendar-weekday">{format(day, 'EEE', { locale: es }).toLowerCase()}</p>
                <p className="calendar-day-num">{format(day, 'd')}</p>
                <p className="calendar-month">{format(day, 'MMM', { locale: es }).toLowerCase()}</p>
              </div>
              <p className={cn('calendar-games-count', {
                'calendar-today-games-count': (matchesOnThisDay > 0) && selectedDay,
              })}>
                {matchesOnThisDay}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PublicCalendar;
