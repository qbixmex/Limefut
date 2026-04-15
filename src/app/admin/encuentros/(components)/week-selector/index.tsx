'use client';

import type { SubmitEvent } from 'react';
import { Fragment, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';

export const WeekSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tournamentSearchParam = searchParams.get('torneo');
  const sortedWeek = searchParams.get('sortWeek');
  const selectedWeek = searchParams.get('semana');
  const weekRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (weekRef.current) {
      weekRef.current.value = sortedWeek ?? selectedWeek ?? '0';
    }
  }, [sortedWeek, selectedWeek]);

  if (!tournamentSearchParam) return null;

  const setWeekParam = (week: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('semana', week);
    params.set('sortWeek', week);
    router.push(`${pathname}?${params}`);
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    setWeekParam(weekRef.current?.value ?? '0');
  };

  return (
    <Fragment key={`week-${sortedWeek ?? 'none'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-5">
          <Label className="space-x-5">
            <span>Jornada</span>
            <Input
              ref={weekRef}
              id="week"
              type="number"
              min={0}
              defaultValue={sortedWeek ?? selectedWeek ?? 0}
              className="w-[75px]"
            />
          </Label>
          <Button
            variant="outline-primary"
            size="icon"
            type="submit"
          >
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default WeekSelector;
