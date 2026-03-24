'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import './styles.css';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  matchesDates: string[];
}>;

export const HorizontalCalendar: FC<Props> = ({ matchesDates }) => {
  const todayInZone = toZonedTime(new Date(), TIME_ZONE);
  const RANGE = 7;
  const [currentDay, setCurrentDay] = useState<Date>(todayInZone);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const days = Array.from(
    { length: RANGE * 2 + 1 },
    (_, index) => addDays(todayInZone, index - RANGE),
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dayRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const index = RANGE;
    const element = dayRefs.current[index];
    const container = containerRef.current;
    if (!element || !container) return;

    const target = element.offsetLeft + element.offsetWidth / 2 - container.clientWidth / 2;
    container.scrollTo({ left: target, behavior: 'smooth' });
  }, [RANGE]);

  const handleSelectDay = (day: Date) => {
    setCurrentDay(day);
    const params = new URLSearchParams(searchParams);
    const dateWithoutTime = formatInTimeZone(day, TIME_ZONE, 'yyyy-MM-dd');
    if (isSameDay(day, todayInZone)) {
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
            (matchDate) => {
              const matchDateInZone = toZonedTime(parseISO(matchDate), TIME_ZONE);
              return isSameDay(day, matchDateInZone);
            },
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
